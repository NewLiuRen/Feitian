import { createReadStream } from 'fs';
import { ipcMain, dialog, shell } from 'electron';
import Excel from 'exceljs';
import { mainWindow } from '../../main.dev';
import { RECORD } from '../../constants/records';

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

// 导入入仓数(订单)模板
ipcMain.on('importRecordsTemplate', (event, arg) => {
  const { warehouseList, goodsList } = arg;
  const workbook = new Excel.Workbook();
  // 仓库名称同id的映射关系
  const warehouseName2IdMap = {};
  warehouseList.sort((a, b) => a.id - b.id).forEach(w => {
    warehouseName2IdMap[w.name] = w.id;
  })
  // 商品sku同id的映射关系
  const goodsSKU2IdMap = {}
  goodsList.sort((a, b) => a.id - b.id).forEach(g => {
    goodsSKU2IdMap[g.sku] = g.id;
  })
  // 序号映射关系
  const indexMap = {}
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Excel', extensions: ['xlsx', 'xls'] }
    ]
  }, path => {
    if (!path) {
      event.sender.send('importRecordsTemplateReply', {success: false, msg: ''});
      return
    }
    workbook.xlsx.readFile(path[0])
      .then(() => {
        const worksheet = workbook.getWorksheet(1)
        const rowsLen = worksheet._rows.length;
        const list = {records: [], error: []};
        let inexistenceWarehouseIdList = null;
        let skuIndex = null;
        let data = {};
        if (rowsLen === 0) {
          event.sender.send('importRecordsTemplateReply', {success: false, msg: '模板中不存在数据'});
          return;
        }
        worksheet.eachRow((row, rowNumber) => {
          let sku = '';
          let recordMap = {};
          row.eachCell((cell, colNumber) => {
            const cellVal = cell.value;
            // 第一列的话查找序号同key的映射
            if (rowNumber === 1 && cellVal in warehouseName2IdMap) {
              // 将warehouse_id存入indexMap
              indexMap[colNumber] = warehouseName2IdMap[cellVal];
            } else if (rowNumber === 1 && cellVal.trim().toLocaleLowerCase() === 'sku') {
              skuIndex = colNumber;
            } else if (rowNumber > 1) {
              if (skuIndex === colNumber) sku = cellVal;
              recordMap[indexMap[colNumber]] = cellVal;
            }
          });
          console.log('recordMap :', recordMap);
          // 遍历完第一行后进行后续操作
          if (rowNumber === 1) {
            // 对sku列进行校验
            if (!skuIndex) {
              event.sender.send('importRecordsTemplateReply', {success: false, msg: '模板中不存在必要列“SKU”'});
              return;
            }
            // 对仓库列进行校验
            if (Object.keys(indexMap).length === 0) {
              event.sender.send('importRecordsTemplateReply', {success: false, msg: '模板中不存在仓库记录或数据管理中不包含文件中的仓库'});
              return;
            }
            // 统计不存在的仓库
            if (warehouseList.length > Object.keys(indexMap).length) {
              const existWarehouseIdList = Object.values(indexMap);
              inexistenceWarehouseIdList = warehouseList.filter(w => !existWarehouseIdList.includes(w.id))
            }
          } else  {
            Object.entries(recordMap).forEach((wid, count) => {
              if (goodsSKU2IdMap[sku]) {
                list.records.push(Object.assign({}, RECORD, {goods_id: goodsSKU2IdMap[sku],warehouse_id: wid, count}));
              } else if (!!sku) {
                list.error.push({sku, rowNumber});
              }
            })
            // 补充未存在的仓库数据
            if (inexistenceWarehouseIdList && inexistenceWarehouseIdList.length > 0 && goodsSKU2IdMap[sku]) {
              inexistenceWarehouseIdList.forEach(wid => {
                list.records.push(Object.assign({}, RECORD, {goods_id: goodsSKU2IdMap[sku], warehouse_id: wid, count: null}));
              })
            }
          }
        });
        event.sender.send('importRecordsTemplateSendData', {...list})
        event.sender.send('importRecordsTemplateReply', {success: true, msg: ''});
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
  // 仓库总数
  const totalWarehouseCount = {};
  // 仓库箱数
  const totalBox = {};
  // 仓库剩余商品数量
  const surplus = {}
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
    const {name, sku, value, max_count} = dataSource[i-1];
    const newRow = { name, sku }
    let sum = 0;
    value.forEach(w => {
      const { id: wkey, count } = w;
      // 计算仓库总数
      if (!totalWarehouseCount[wkey]) {
        totalWarehouseCount[wkey] = count;
      } else {
        totalWarehouseCount[wkey] += count;
      }
      // 计算仓库总箱数
      if (!totalBox[wkey]) {
        totalBox[wkey] = Math.floor(count/max_count);
      } else {
        totalBox[wkey] += Math.floor(count/max_count);
      }
      // 计算剩余商品数量
      if (count%max_count !== 0) {
        if (!surplus[wkey]) surplus[wkey] = []
        surplus[wkey].push({goods: name, count: count % max_count});
      }
      newRow[`warehouse_${w.id}`] = w.count;
      sum += w.count;
    })
    sheet.addRow(newRow);
    const row = sheet.getRow(i+1);
    row.getCell('total').value = { formula: generateHorizontalFormula(warehouseList, i+1), result: sum }
    setRowStyle(columns, sheet, i+1, DEFAULT_STYLE, ['border', 'alignment']);
    row.height = 22;
  }

  const warehouseCountRow = { name: '合计' };
  const boxCountRow = { name: '箱数' };
  const surplusRow = {};
  warehouseList.forEach(w => {
    warehouseCountRow[`warehouse_${w.id}`] = totalWarehouseCount[w.id];
    boxCountRow[`warehouse_${w.id}`] = `${totalBox[w.id]}${surplus[w.id] ? `(${surplus[w.id].reduce((p, c) => p + c.count, 0)})` : ''}`;
    surplusRow[`warehouse_${w.id}`] = surplus[w.id] ? surplus[w.id].map(s => `${s.goods}(${s.count})`).join('\r\n') : '';
  })
  // 添加仓库总数行
  sheet.addRow(warehouseCountRow);
  sheet.lastRow.getCell('total').value = { formula: generateHorizontalFormula(warehouseList, dataSource.length+1), result: Object.values(totalWarehouseCount).reduce((p, c) => p + c, 0) }
  sheet.lastRow.height = 22;
  sheet.lastRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };
    cell.alignment = { vertical: 'middle', horizontal: 'right' };
    if (colNumber > 2) {
      cell.value = { formula: `SUM(${String.fromCharCode(67+Number(colNumber-3))}2:${String.fromCharCode(67+Number(colNumber-3))}${1+dataSource.length})`, result: parseInt(cell.text, 10) };
    }
  });
  // 添加仓库箱数
  sheet.addRow(boxCountRow);
  sheet.lastRow.getCell('total').value = { formula: generateHorizontalFormula(warehouseList, dataSource.length+2), result: Object.values(totalBox).reduce((p, c) => p + c, 0) }
  sheet.lastRow.height = 22;
  sheet.lastRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };
    cell.alignment = { vertical: 'middle', horizontal: 'right' };
  });
  // 添加剩余商品明细
  sheet.addRow(surplusRow);
  sheet.lastRow.height = 22;
  sheet.lastRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.alignment = { wrapText: true };
    cell.border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  sheet.lastRow.getCell('total').border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  };
  // 设置第一行样式
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

// 导出箱贴
ipcMain.on('exportOrderLabel', (event, arg) => {
  const { path, create_date, dataSource } = arg;
  // 创建工作簿
  const workbook = new Excel.Workbook();
  let totalCount = 0;

  // 添加工作表
  // const sheet = workbook.addWorksheet('商品模板', {views:[{state: 'frozen', xSplit: 2, ySplit: 1}]});
  const generateLabel = (worksheet, data, params, rowIndex) => {
    // { order_number: '', goods: [{name: '', count: null}] }
    const { warehouseName, label, } = params;
    const { order_number, goods, } = data;
    const setStyle = (node, styleName, style={}) => {
      const defaultStyle = {
        fill: {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFFCD5B4'}
        },
        font: { name: 'SimSun', size: 20, bold: true, },
        border: {
          top: {style:'thin'},
          bottom: {style:'thin'},
          left: {style:'thick'},
          right: {style:'thick'},
        },
        alignment: { 
          vertical: 'middle',
          horizontal: 'left',
        }
      };
      Object.keys(style).forEach(s => {
        defaultStyle[s] = Object.assign({}, defaultStyle[s], style[s]);
      })
      let styleNameArr = styleName;
      if (!Array.isArray(styleName)) styleNameArr = [...styleNameArr];
      styleNameArr.forEach(s => {
        node[s] =  defaultStyle[s];
      })
    }

    worksheet.columns = [
      { key: 'key', width: 22 },
      { key: 'value', width: 54, style: { alignment: { wrapText: true } } },
    ];    
    
    worksheet.addRow(['供应商名称', '天津飞天孚泽科技股份有限公司']);
    worksheet.addRow(['采购单号', order_number]);
    worksheet.addRow(['目的城市', warehouseName]);
    worksheet.addRow(['商品名称', goods.map(g => `${g.name} ${g.count}`).join('\r\n')]);
    worksheet.addRow(['实装数量', goods.reduce((p, c) => p + c.count, 0)]);
    worksheet.addRow(['箱号', `${warehouseName}${label}`]);
    worksheet.addRow();

    const row1 = worksheet.getRow(rowIndex);
    const row1cellL = worksheet.getCell(`A${rowIndex}`);
    const row1cellR = worksheet.getCell(`B${rowIndex}`);
    const row1cellC = worksheet.getCell('C1');
    const row2 = worksheet.getRow(rowIndex+1);
    const row2cellL = worksheet.getCell(`A${rowIndex+1}`);
    const row2cellR = worksheet.getCell(`B${rowIndex+1}`);
    const row3 = worksheet.getRow(rowIndex+2);
    const row3cellL = worksheet.getCell(`A${rowIndex+2}`);
    const row3cellR = worksheet.getCell(`B${rowIndex+2}`);
    const row4 = worksheet.getRow(rowIndex+3);
    const row4cellL = worksheet.getCell(`A${rowIndex+3}`);
    const row4cellR = worksheet.getCell(`B${rowIndex+3}`);
    const row5 = worksheet.getRow(rowIndex+4);
    const row5cellL = worksheet.getCell(`A${rowIndex+4}`);
    const row5cellR = worksheet.getCell(`B${rowIndex+4}`);
    const row6 = worksheet.getRow(rowIndex+5);
    const row6cellL = worksheet.getCell(`A${rowIndex+5}`);
    const row6cellR = worksheet.getCell(`B${rowIndex+5}`);
    const row7 = worksheet.getRow(rowIndex+6);

    // 产生公式
    row1cellC.value = { formula: 'SUMIF(A$1:A$59261,A5,B$1:B$59261)', result: totalCount };
    // 样式设置
    row1.height = 36;
    row2.height = 36;
    row3.height = 36;
    row4.height = goods.length > 2 ? 36 + (goods.length - 2)*20 : 36;
    row5.height = 36;
    row6.height = 36;
    row7.height = 36;
    setStyle(row1cellL, ['font', 'alignment', 'border'], { border: { top: {style:'thick'}, right: {style:'thin'}, }, });
    setStyle(row1cellR, ['font', 'alignment', 'border'], { border: { top: {style:'thick'}, left: {style:'thin'}, }, });
    setStyle(row2cellL, ['font', 'alignment', 'border'], { border: { right: {style:'thin'} } });
    setStyle(row2cellR, ['font', 'alignment', 'border'], { border: { left: {style:'thin'} }, alignment: {horizontal: 'center',}, });
    // setStyle(row3, ['font', 'alignment', 'border']);
    setStyle(row3cellL, ['font', 'alignment', 'border'], { border: { right: {style:'thin'}, }, });
    setStyle(row3cellR, ['font', 'alignment', 'border'], { border: { left: {style:'thin'}, }, });
    setStyle(row4cellL, ['font', 'alignment', 'border'], { border: { right: {style:'thin'} }});
    setStyle(row4cellR, goods.length > 2 ? ['font', 'alignment', 'border', 'fill'] : ['font', 'alignment', 'border'], { border: { left: {style:'thin'} }, alignment: {horizontal: 'center',  wrapText: true }, font: {size: 14, bold: false,},});
    // setStyle(row5, ['font', 'alignment', 'border']);
    setStyle(row5cellL, ['font', 'alignment', 'border'], { border: { right: {style:'thin'}, }, });
    setStyle(row5cellR, ['font', 'alignment', 'border'], { border: { left: {style:'thin'}, }, });
    setStyle(row6cellL, ['font', 'alignment', 'border'], { border: { bottom: {style:'thick'}, right: {style:'thin'}, }, });
    setStyle(row6cellR, ['font', 'alignment', 'border'], { border: { bottom: {style:'thick'}, left: {style:'thin'}, }, });
  }

  // 生成工作表
  const generateWorksheet = (workbook, warehouseName, data) => {
    let sheet = null;
    if (data.some(d => d.goods.length > 2)) {
      sheet = workbook.addWorksheet(warehouseName, {properties:{tabColor:{argb:'FC00000'}}});
    } else {
      sheet = workbook.addWorksheet(warehouseName);
    }
    data.forEach((d, i) => {
      generateLabel(sheet, d, {warehouseName, label: i+1}, i*7+1);
    })
  }

  /*
  full: { count: 12, goods_id: 253, labels: [2, 3], name: "双面绒拉链被雅致灰", order_number: "103" },
  share: { goods: [{count: 6, goods_id: 268}], label: 14, order_number: "103", }
  */
  Object.values(dataSource).forEach(labels => {
    const { name, full, share } = labels;
    totalCount = 0;
    // { order_number: '', goods: [{name: '', count: null}], [label: null,] }
    let data = [];
    full.forEach(f => {
      const { labels, count, name, order_number } = f;
      labels.forEach(l => {
        totalCount += count;
        data[l] = { order_number, goods: [{ name, count }] }
      })
    })
    share.forEach(s => {
      const { label, order_number, goods } = s;
      data[label] = { order_number, goods: goods.map(({name, count}) => {
        totalCount += count;
        return {name, count}
      }) }
    })
    data = data.filter(d => d);
    generateWorksheet(workbook, name, data);
  })

  const d = new Date(parseInt(create_date, 10));
  const name = `${d.getFullYear()}.${d.getMonth() + 1 < 10 ? `0${  d.getMonth()  }${1}` : d.getMonth() + 1}.${d.getDate() < 10 ? `0${  d.getDate()}` : d.getDate()}箱贴.xlsx`
  workbook.xlsx.writeFile(`${path}/${name}`)
    .then(() => {
      event.sender.send('exportOrderLabelReply', {success: true, msg: '导出成功'})
      shell.showItemInFolder(`${path}/${name}`)
      return null
    }).catch(err => {
      event.sender.send('exportOrderLabelReply', {success: false, msg: '导出失败，请检查该文件是否已被打开'})
    });
})
