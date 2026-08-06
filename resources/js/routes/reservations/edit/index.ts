import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
export const step = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: step.url(args, options),
    method: 'get',
})

step.definition = {
    methods: ["get","head"],
    url: '/reservations/{reservation_id}/edit/step/{step}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
step.url = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reservation_id: args[0],
                    step: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation_id: args.reservation_id,
                                step: args.step,
                }

    return step.definition.url
            .replace('{reservation_id}', parsedArgs.reservation_id.toString())
            .replace('{step}', parsedArgs.step.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
step.get = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: step.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
step.head = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: step.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
    const stepForm = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: step.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
        stepForm.get = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: step.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservationController::step
 * @see app/Http/Controllers/ReservationController.php:271
 * @route '/reservations/{reservation_id}/edit/step/{step}'
 */
        stepForm.head = (args: { reservation_id: string | number, step: string | number } | [reservation_id: string | number, step: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: step.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    step.form = stepForm
const edit = {
    step: Object.assign(step, step),
}

export default edit