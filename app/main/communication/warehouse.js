import { ipcMain } from 'electron';
import * as sql from '../sql/row.warehouse'
import * as db from '../../db/warehouse'

ipcMain.on('getWarehouseList', (event, arg) => {
  sql.queryWarehouseWithoutDel().then(res => {
    event.sender.send('getWarehouseListResult', res)
  })
})

ipcMain.on('addWarehouse', (event, arg) => {
  sql.insertWarehouse({name: '仓库1'}).then(res => {
    event.sender.send('addWarehouseResult', res)
  })
})
