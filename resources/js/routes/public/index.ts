import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
export const track = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: track.url(args, options),
    method: 'get',
})

track.definition = {
    methods: ["get","head"],
    url: '/track/{waybill}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
track.url = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return track.definition.url
            .replace('{waybill}', parsedArgs.waybill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
track.get = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: track.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
track.head = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: track.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
    const trackForm = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: track.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
        trackForm.get = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: track.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicTrackController::track
 * @see app/Http/Controllers/PublicTrackController.php:12
 * @route '/track/{waybill}'
 */
        trackForm.head = (args: { waybill: string | number } | [waybill: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: track.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    track.form = trackForm
const publicMethod = {
    track: Object.assign(track, track),
}

export default publicMethod