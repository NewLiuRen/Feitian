import { writeFile } from 'fs';
import { ipcMain, dialog, shell } from 'electron';
import Excel from 'exceljs';
import { mainWindow } from '../../main.dev';

// 选择文件夹
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
  const style = {
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
  const columns = [
    { header: '', key: 'index', width: 5 },
    { header: '名称', key: 'name', width: 25 },
    { header: 'SKU', key: 'sku', width: 20 },
    { header: '类目', key: 'category', width: 20 },
    { header: '个数/箱', key: 'max_count', width: 10 },
    { header: '描述', key: 'description', width: 35 },
  ];
  const setRowStyle = (sheet, index, style, styleList) => {
    const row = sheet.getRow(index);
    columns.forEach(c => {
      const cell = row.getCell(c.key);
      styleList.forEach(s => {
        if (Object.keys(style).find(k => k === s)) cell[s] = style[s]
      })
    })
  }
  // 创建工作簿
  const workbook = new Excel.Workbook();
  // 添加工作表，冻结第一行
  var sheet = workbook.addWorksheet('商品模板', {views:[{state: 'frozen', xSplit: 1, ySplit: 1}]});
  // 添加列标题并定义列键和宽度
  sheet.columns = columns;

  for(let i=1, len=300 ; i<=len ; i+=1) {
    sheet.addRow({index: i, name: '', sku: '', category: '', max_count: '', description: '', });
    const row = sheet.getRow(i+1);
    row.height = 22;
    setRowStyle(sheet, i+1, style, ['border', 'alignment']);
    row.getCell('index').font = style.font;
    row.getCell('index').fill = style.fill;
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

  // 为第一行添加样式
  setRowStyle(sheet, 1, style, ['font', 'fill', 'border', 'alignment']);
  sheet.getRow(1).height = 25

  const name = '商品批量导入模板.xlsx'
  workbook.xlsx.writeFile(`${path}/${name}`)
    .then(() => {
      event.sender.send('exportGoodsTemplateReply', {success: true, msg: '导出成功'})
      shell.showItemInFolder(`${path}/${name}`)
    }).catch(err => {
      event.sender.send('exportGoodsTemplateReply', {success: false, msg: '导出失败，请检查该文件是否已被打开'})
    });
})
