import TaskController from './TaskController'
import InspectionController from './InspectionController'
import ExpenseController from './ExpenseController'
const Driver = {
    TaskController: Object.assign(TaskController, TaskController),
InspectionController: Object.assign(InspectionController, InspectionController),
ExpenseController: Object.assign(ExpenseController, ExpenseController),
}

export default Driver