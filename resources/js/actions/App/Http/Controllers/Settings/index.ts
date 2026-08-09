import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import PricingController from './PricingController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
PricingController: Object.assign(PricingController, PricingController),
}

export default Settings