import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
export const show = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/track/{waybill}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
show.url = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { waybill: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    waybill: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        waybill: args.waybill,
                }

    return show.definition.url
            .replace('{waybill}', parsedArgs.waybill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
show.get = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
show.head = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
    const showForm = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
        showForm.get = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicTrackController::show
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
        showForm.head = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const PublicTrackController = { show }

export default PublicTrackController