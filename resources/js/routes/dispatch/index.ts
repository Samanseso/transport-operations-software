import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AutoDispatchController::auto
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
export const auto = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: auto.url(options),
    method: 'post',
})

auto.definition = {
    methods: ["post"],
    url: '/dispatch/auto-run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AutoDispatchController::auto
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
auto.url = (options?: RouteQueryOptions) => {
    return auto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AutoDispatchController::auto
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
auto.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: auto.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AutoDispatchController::auto
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
    const autoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: auto.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AutoDispatchController::auto
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
        autoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: auto.url(options),
            method: 'post',
        })
    
    auto.form = autoForm
const dispatch = {
    auto: Object.assign(auto, auto),
}

export default dispatch