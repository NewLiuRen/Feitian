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
  console.log('arg :', arg);
  console.log('path :', path);
  console.log('categoryList :', categoryList);
  // 创建工作簿
  const workbook = new Excel.Workbook();
  // 添加工作表，冻结第一行
  var sheet = workbook.addWorksheet('商品模板', {views:[{xSplit: 1, ySplit: 1}]});
  const style = {
    font: {color: { argb: 'FFFFFFFF' }},
    fill: {
      type: 'pattern',
      pattern:'darkVertical',
      bgColor:{argb:'FF244062'}
    }
  }
  // 添加列标题并定义列键和宽度
  sheet.columns = [
    { header: '', key: 'index', width: 5, style },
    { header: '名称', key: 'name', width: 25, style },
    { header: 'SKU', key: 'sku', width: 20, style },
    { header: '类目', key: 'category', width: 20, style },
    { header: '个数/箱', key: 'max_count', width: 10, style },
    { header: '描述', key: 'description', width: 35, style },
  ];

  for(let i=1, len=300 ; i<=len ; i+=1) {
    sheet.addRow({index: i, name: '', sku: '', category: '', max_count: '', description: '', });
    const row = sheet.getRow(i+1);
    row.getCell('index').font = style.font;
    row.getCell('index').fill = style.fill;
    row.getCell('category').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [1, 2, 3, 4, 5],
    };
    row.getCell('max_count').dataValidation = {
      type: 'whole',
      allowBlank: false,
      operator: 'greaterThan',
      showErrorMessage: true,
      formulae: [0],
      errorStyle: 'error',
      errorTitle: '1',
      error: '每箱个数不得小于1'
    };
  }

  workbook.xlsx.writeFile(`${path}/商品导入模板`)
    .then(function() {
      console.log('success');
      shell.showItemInFolder(path)
    });
})
