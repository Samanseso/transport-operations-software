import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import portal from './portal'
/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
export const invoices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoices.url(options),
    method: 'get',
})

invoices.definition = {
    methods: ["get","head"],
    url: '/customer/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
invoices.url = (options?: RouteQueryOptions) => {
    return invoices.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
invoices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoices.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
invoices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoices.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
    const invoicesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: invoices.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
        invoicesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoices.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
        invoicesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoices.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    invoices.form = invoicesForm
const customer = {
    invoices: Object.assign(invoices, invoices),
portal: Object.assign(portal, portal),
}

export default customer