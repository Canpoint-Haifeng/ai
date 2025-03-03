import Topbar from './Topbar/Topbar'
import NewTopbar from './Topbar/NewTopbar'
import TopSearch from './TopSearch/TopSearch'
import Nav from './Nav/Nav'
import AppLogin from './AppLogin/AppLogin'
import ToolBasket from './ToolBasket/ToolBasket'
import Backtop from './Backtop/Backtop'
import Footer from './Footer/Footer'
import Pagination from '@/components/Pagination/Pagination'
import appBroadsideBack from './Backtop/app-broadside-back'
import VideoPlay from './VideoPlay/VideoPlay'
import HomePageSearch from './TopSearch/HomePageSearch'
import NoresultCommon from '@/components/Noresult/Noresult-common'

export default {
  install: (app) => {
    app.component('AppTopBar', Topbar)
    app.component('AppNewTopBar', NewTopbar)
    app.component('AppTopSearch', TopSearch)
    app.component('AppNav', Nav)
    app.component('AppLogin', AppLogin)
    app.component('AppToolBasket', ToolBasket)
    app.component('AppBacktop', Backtop)
    app.component('AppBroadsideBack', appBroadsideBack)
    app.component('AppFooter', Footer)
    app.component('NoresultCommon', NoresultCommon)
    app.component('Pagination', Pagination)
    app.component('VideoPlay', VideoPlay)
    app.component('HomePageSearch', HomePageSearch)
  },
}
