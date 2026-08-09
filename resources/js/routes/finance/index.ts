import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import cod from './cod'
/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
 */
export const invoices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoices.url(options),
    method: 'get',
})

invoices.definition = {
    methods: ["get","head"],
    url: '/finance/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
 */
invoices.url = (options?: RouteQueryOptions) => {
    return invoices.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
 */
invoices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoices.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
 */
invoices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoices.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
 */
    const invoicesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: invoices.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
 */
        invoicesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoices.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FinanceController::invoices
 * @see app/Http/Controllers/FinanceController.php:14
 * @route '/finance/invoices'
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
/**
* @see \App\Http\Controllers\FinanceController::pay
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
export const pay = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/finance/invoices/{id}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::pay
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
pay.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return pay.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::pay
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
pay.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FinanceController::pay
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
    const payForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: pay.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FinanceController::pay
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
        payForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: pay.url(args, options),
            method: 'post',
        })
    
    pay.form = payForm
const finance = {
    invoices: Object.assign(invoices, invoices),
pay: Object.assign(pay, pay),
cod: Object.assign(cod, cod),
}

export default finance