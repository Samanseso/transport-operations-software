import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/my-active-reservations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MyActiveReservationsController::index
 * @see app/Http/Controllers/MyActiveReservationsController.php:11
 * @route '/my-active-reservations'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
export const show = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/my-active-reservations/{selectedReservation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
show.url = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { selectedReservation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    selectedReservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        selectedReservation: args.selectedReservation,
                }

    return show.definition.url
            .replace('{selectedReservation}', parsedArgs.selectedReservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
show.get = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
show.head = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
    const showForm = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
        showForm.get = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MyActiveReservationsController::show
 * @see app/Http/Controllers/MyActiveReservationsController.php:54
 * @route '/my-active-reservations/{selectedReservation}'
 */
        showForm.head = (args: { selectedReservation: string | number } | [selectedReservation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const myActiveReservations = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default myActiveReservations