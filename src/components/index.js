import Topbar from './Topbar/Topbar.vue'
import NewTopbar from './Topbar/NewTopbar.vue'
import TopSearch from './TopSearch/TopSearch.vue'
import Nav from './Nav/Nav.vue'
import AppLogin from './AppLogin/AppLogin.vue'
import ToolBasket from './ToolBasket/ToolBasket.vue'
import Backtop from './Backtop/Backtop.vue'
import Footer from './Footer/Footer.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import appBroadsideBack from './Backtop/app-broadside-back.vue'
import VideoPlay from './VideoPlay/VideoPlay.vue'
import HomePageSearch from './TopSearch/HomePageSearch.vue'
import NoresultCommon from '@/components/Noresult/Noresult-common.vue'

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
