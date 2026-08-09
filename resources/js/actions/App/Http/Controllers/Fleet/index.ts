import MaintenanceController from './MaintenanceController'
import TelematicsController from './TelematicsController'
import FuelController from './FuelController'
const Fleet = {
    MaintenanceController: Object.assign(MaintenanceController, MaintenanceController),
TelematicsController: Object.assign(TelematicsController, TelematicsController),
FuelController: Object.assign(FuelController, FuelController),
}

export default Fleet