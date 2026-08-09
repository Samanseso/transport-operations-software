import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/finance/cod-remittance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Finance\CodRemittanceController::index
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:13
 * @route '/finance/cod-remittance'
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
* @see \App\Http\Controllers\Finance\CodRemittanceController::verify
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:26
 * @route '/finance/cod-remittance/{id}/verify'
 */
export const verify = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/finance/cod-remittance/{id}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Finance\CodRemittanceController::verify
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:26
 * @route '/finance/cod-remittance/{id}/verify'
 */
verify.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return verify.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Finance\CodRemittanceController::verify
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:26
 * @route '/finance/cod-remittance/{id}/verify'
 */
verify.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Finance\CodRemittanceController::verify
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:26
 * @route '/finance/cod-remittance/{id}/verify'
 */
    const verifyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Finance\CodRemittanceController::verify
 * @see app/Http/Controllers/Finance/CodRemittanceController.php:26
 * @route '/finance/cod-remittance/{id}/verify'
 */
        verifyForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(args, options),
            method: 'post',
        })
    
    verify.form = verifyForm
const CodRemittanceController = { index, verify }

export default CodRemittanceController