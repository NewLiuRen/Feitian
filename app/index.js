import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { initStores } from './db';

// 初始化日期语言格式
moment.locale('zh-cn');
// 初始化数据库
initStores();
const store = configureStore();

render(
  <AppContainer>
    <LocaleProvider locale={zh_CN}>
      <Root store={store} history={history} />
    </LocaleProvider>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <LocaleProvider locale={zh_CN}>
          <NextRoot store={store} history={history} />
        </LocaleProvider>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
