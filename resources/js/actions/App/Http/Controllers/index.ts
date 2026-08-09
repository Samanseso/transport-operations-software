import PublicTrackController from './PublicTrackController'
import DashboardController from './DashboardController'
import Admin from './Admin'
import FinanceController from './FinanceController'
import Finance from './Finance'
import Customer from './Customer'
import Hub from './Hub'
import Fleet from './Fleet'
import CustomerController from './CustomerController'
import Settings from './Settings'
import Auth from './Auth'
import UserController from './UserController'
import ReservationController from './ReservationController'
import ActiveDispatchController from './ActiveDispatchController'
import FleetController from './FleetController'
import Driver from './Driver'
import SystemLogController from './SystemLogController'
import MyReservationController from './MyReservationController'
import MyActiveReservationsController from './MyActiveReservationsController'
const Controllers = {
    PublicTrackController: Object.assign(PublicTrackController, PublicTrackController),
DashboardController: Object.assign(DashboardController, DashboardController),
Admin: Object.assign(Admin, Admin),
FinanceController: Object.assign(FinanceController, FinanceController),
Finance: Object.assign(Finance, Finance),
Customer: Object.assign(Customer, Customer),
Hub: Object.assign(Hub, Hub),
Fleet: Object.assign(Fleet, Fleet),
CustomerController: Object.assign(CustomerController, CustomerController),
Settings: Object.assign(Settings, Settings),
Auth: Object.assign(Auth, Auth),
UserController: Object.assign(UserController, UserController),
ReservationController: Object.assign(ReservationController, ReservationController),
ActiveDispatchController: Object.assign(ActiveDispatchController, ActiveDispatchController),
FleetController: Object.assign(FleetController, FleetController),
Driver: Object.assign(Driver, Driver),
SystemLogController: Object.assign(SystemLogController, SystemLogController),
MyReservationController: Object.assign(MyReservationController, MyReservationController),
MyActiveReservationsController: Object.assign(MyActiveReservationsController, MyActiveReservationsController),
}

export default Controllers