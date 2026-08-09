import MaintenanceController from './MaintenanceController'
import SparePartController from './SparePartController'
import TelematicsController from './TelematicsController'
import FuelController from './FuelController'
const Fleet = {
    MaintenanceController: Object.assign(MaintenanceController, MaintenanceController),
SparePartController: Object.assign(SparePartController, SparePartController),
TelematicsController: Object.assign(TelematicsController, TelematicsController),
FuelController: Object.assign(FuelController, FuelController),
}

export default Fleet