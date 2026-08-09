import AnalyticsController from './AnalyticsController'
import AutoDispatchController from './AutoDispatchController'
const Admin = {
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
AutoDispatchController: Object.assign(AutoDispatchController, AutoDispatchController),
}

export default Admin