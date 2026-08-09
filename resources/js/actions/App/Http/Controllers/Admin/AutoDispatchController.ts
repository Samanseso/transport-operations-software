import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AutoDispatchController::triggerAutoDispatch
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
export const triggerAutoDispatch = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: triggerAutoDispatch.url(options),
    method: 'post',
})

triggerAutoDispatch.definition = {
    methods: ["post"],
    url: '/dispatch/auto-run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AutoDispatchController::triggerAutoDispatch
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
triggerAutoDispatch.url = (options?: RouteQueryOptions) => {
    return triggerAutoDispatch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AutoDispatchController::triggerAutoDispatch
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
triggerAutoDispatch.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: triggerAutoDispatch.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AutoDispatchController::triggerAutoDispatch
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
    const triggerAutoDispatchForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: triggerAutoDispatch.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AutoDispatchController::triggerAutoDispatch
 * @see app/Http/Controllers/Admin/AutoDispatchController.php:11
 * @route '/dispatch/auto-run'
 */
        triggerAutoDispatchForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: triggerAutoDispatch.url(options),
            method: 'post',
        })
    
    triggerAutoDispatch.form = triggerAutoDispatchForm
const AutoDispatchController = { triggerAutoDispatch }

export default AutoDispatchController