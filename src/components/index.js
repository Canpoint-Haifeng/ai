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
  install: function (app) {
    app.component('app-top-bar', Topbar)
    app.component('app-new-top-bar', NewTopbar)
    app.component('app-top-search', TopSearch)
    app.component('app-nav', Nav)
    app.component('app-login', AppLogin)
    app.component('app-tool-basket', ToolBasket)
    app.component('app-backtop', Backtop)
    app.component('app-broadside-back', appBroadsideBack)
    app.component('app-footer', Footer)
    app.component('noresult-common', NoresultCommon)
    app.component('pagination', Pagination)
    app.component('VideoPlay', VideoPlay)
    app.component('HomePageSearch', HomePageSearch)
  },
}
