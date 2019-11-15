import { createReadStream } from 'fs';
import { ipcMain, dialog, shell } from 'electron';
import Excel from 'exceljs';
import { mainWindow } from '../../main.dev';

// excel通用样式
const DEFAULT_STYLE = {
  font: {color: { argb: 'FFFFFFFF' }},
  fill: {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'FF244062'}
  },
  border: {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  },
  alignment: { 
    vertical: 'middle',
  }
}
// 模板列定义
const COLUMNS = [
  { header: '', key: 'index', width: 5 },
  { header: '名称', key: 'name', width: 25 },
  { header: 'SKU', key: 'sku', width: 20 },
  { header: '类目', key: 'category', width: 20 },
  { header: '个数/箱', key: 'max_count', width: 10 },
  { header: '描述', key: 'description', width: 35 },
];
  
const setRowStyle = (columns, sheet, index, styleRule, styleList) => {
  const row = sheet.getRow(index);
  columns.forEach(c => {
    const cell = row.getCell(c.key);
    styleList.forEach(s => {
      if (Object.keys(styleRule).find(k => k === s)) cell[s] = styleRule[s]
    })
  })
}

// 选择导出文件路径
ipcMain.on('selectExportPath', (event, arg) => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  }, path => {
    event.sender.send('selectedExportPath', path)
  })
})

// 导出商品模板
ipcMain.on('exportGoodsTemplate', (event, arg) => {
  const { path, categoryList } = arg;

  // 创建工作簿
  const workbook = new Excel.Workbook();
  // 添加工作表，冻结第一行
  const sheet = workbook.addWorksheet('商品模板', {views:[{state: 'frozen', xSplit: 2, ySplit: 1}]});
  // 添加列标题并定义列键和宽度
  sheet.columns = COLUMNS;

  // 解释说明
  const cellInfo = sheet.getCell('G1')
  cellInfo.value = '*注：名称、SKU、个数/箱三列为必填项，若不填写则会导致数据导入失败';
  cellInfo.font = {color: { argb: 'FFC00000' }};

  for(let i=1, len=300 ; i<=len ; i+=1) {
    sheet.addRow({index: i, name: '', sku: '', category: '', max_count: '', description: '', });
    const row = sheet.getRow(i+1);
    row.height = 22;
    setRowStyle(COLUMNS, sheet, i+1, DEFAULT_STYLE, ['border', 'alignment']);
    row.getCell('index').font = DEFAULT_STYLE.font;
    row.getCell('index').fill = DEFAULT_STYLE.fill;
    row.getCell('category').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`"${categoryList.map(c => c.name).join(',')}"`],
    };
    row.getCell('max_count').dataValidation = {
      type: 'whole',
      allowBlank: false,
      operator: 'greaterThan',
      showErrorMessage: true,
      formulae: [0],
      errorStyle: 'error',
      errorTitle: '错误',
      error: '每箱个数不得小于1且必须为整数'
    };
  }

  setRowStyle(COLUMNS, sheet, 1, DEFAULT_STYLE, ['font', 'fill', 'border', 'alignment']);
  sheet.getRow(1).height = 25

  const name = '商品批量导入模板.xlsx'
  workbook.xlsx.writeFile(`${path}/${name}`)
    .then(() => {
      event.sender.send('exportGoodsTemplateReply', {success: true, msg: '导出成功'})
      shell.showItemInFolder(`${path}/${name}`)
      return null
    }).catch(err => {
      event.sender.send('exportGoodsTemplateReply', {success: false, msg: '导出失败，请检查该文件是否已被打开'})
    });
})

// 导入商品模板
ipcMain.on('importGoodsTemplate', (event) => {
  const workbook = new Excel.Workbook();
  // 列名称同key的映射关系
  const column2keyMap = {}
  // key同列名的映射关系
  const key2columnMap = {}
  // 序号映射关系
  const indexMap = {}
  COLUMNS.forEach(c => {
    column2keyMap[c.header] = c.key;
    key2columnMap[c.key] = c.header;
  })
  const goods = {index: '', name: '', description: '', category: '', sku: '', max_count: '',}
  
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Excel', extensions: ['xlsx', 'xls'] }
    ]
  }, path => {
    if (!path) {
      event.sender.send('importGoodsTemplateReply', {success: false, msg: ''});
      return
    }
    workbook.xlsx.readFile(path[0])
      .then(() => {
        const worksheet = workbook.getWorksheet(1)
        const rowsLen = worksheet._rows.length;
        const list = [];
        let data = {};
        if (rowsLen === 0) {
          event.sender.send('importGoodsTemplateReply', {success: false, msg: '模板中不存在数据'});
          return;
        }
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) data = null;
          else data = Object.assign({}, goods);
          row.eachCell((cell, colNumber) => {
            const cellVal = cell.value;
            // 第一列的话查找序号同key的映射
            if (rowNumber === 1 && cellVal in column2keyMap) {
              indexMap[colNumber] = column2keyMap[cellVal];
            } else if (data) {
              data[indexMap[colNumber]] = cellVal;
            }
          });
          // 除序号外其他属性，用来检验数据是否有效
          const dataExceptIndex = Object.assign({}, data);
          delete dataExceptIndex.index
          // 除序号外，若数据都为空，则为无效数据，否则为有效数据，向渲染进程发送该数据
          if (Object.values(dataExceptIndex).some(v => v)) {
            data.index = rowNumber;
            list.push(data);
          }
        });
        event.sender.send('importGoodsTemplateSendData', {list})
        event.sender.send('importGoodsTemplateReply', {success: true, msg: ''});
        return null;
      });
  })
})

// 导出入仓数
ipcMain.on('exportDataInput', (event, arg) => {
  const { path, fileName, dataSource } = arg;
  const warehouseList = dataSource[0].value;
  // 创建工作簿
  const workbook = new Excel.Workbook();
  // 添加工作表，冻结第一行
  const sheet = workbook.addWorksheet('Sheet1', {views:[{state: 'frozen', xSplit: 0, ySplit: 1}]});
  // 添加列标题并定义列键和宽度
  const columns = [
    { header: 'SKU', key: 'sku', width: 15, alignment: { vertical: 'middle', horizontal: 'right' } },
    { header: '名称', key: 'name', width: 25, alignment: { vertical: 'middle', horizontal: 'left' } }
  ];
  const generateHorizontalFormula = (wList, index) => {
    const formula = [];
    wList.forEach((w, i) => {
      formula.push(`${String.fromCharCode(67+i)}${index}`);
    })
    return formula.join('+');
  }
  warehouseList.forEach(w => {
    columns.push({ header: w.name, key: `warehouse_${w.id}`, width: 8, alignment: { vertical: 'middle', horizontal: 'right' } });
  })
  columns.push({header: '合计', key: 'total', width: 8, alignment: { vertical: 'middle', horizontal: 'right' } });
  sheet.columns = columns;

  for(let i=1, len=dataSource.length ; i<=len ; i+=1) {
    const {name, sku, value} = dataSource[i-1];
    const newRow = { name, sku }
    let sum = 0;
    value.forEach(w => {
      newRow[`warehouse_${w.id}`] = w.count;
      sum += w.count;
    })
    sheet.addRow(newRow);
    const row = sheet.getRow(i+1);
    row.getCell('total').value = { formula: generateHorizontalFormula(warehouseList, i+1), result: sum }
    setRowStyle(columns, sheet, i+1, DEFAULT_STYLE, ['border', 'alignment']);
    row.height = 22;
  }

  sheet.getRow(1).height = 25
  setRowStyle(columns, sheet, 1, DEFAULT_STYLE, ['border', 'alignment']);
  sheet.getRow(1).getCell('sku').fill = {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'FFFFFF00'}
  }
  sheet.getRow(1).getCell('name').fill = {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'FFFFFF00'}
  }

  const name = `${fileName}.xlsx`
  workbook.xlsx.writeFile(`${path}/${name}`)
    .then(() => {
      event.sender.send('exportDataInputReply', {success: true, msg: '导出成功'})
      shell.showItemInFolder(`${path}/${name}`)
      return null
    }).catch(err => {
      event.sender.send('exportDataInputReply', {success: false, msg: '导出失败，请检查该文件是否已被打开'})
    });
})
