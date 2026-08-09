import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\FinanceController::markPaid
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
export const markPaid = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markPaid.url(args, options),
    method: 'post',
})

markPaid.definition = {
    methods: ["post"],
    url: '/finance/invoices/{id}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::markPaid
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
markPaid.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return markPaid.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::markPaid
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
markPaid.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markPaid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FinanceController::markPaid
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
    const markPaidForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markPaid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FinanceController::markPaid
 * @see app/Http/Controllers/FinanceController.php:45
 * @route '/finance/invoices/{id}/pay'
 */
        markPaidForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markPaid.url(args, options),
            method: 'post',
        })
    
    markPaid.form = markPaidForm
/**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
export const customerInvoices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customerInvoices.url(options),
    method: 'get',
})

customerInvoices.definition = {
    methods: ["get","head"],
    url: '/customer/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
customerInvoices.url = (options?: RouteQueryOptions) => {
    return customerInvoices.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
customerInvoices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customerInvoices.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
customerInvoices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customerInvoices.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
    const customerInvoicesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: customerInvoices.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
        customerInvoicesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customerInvoices.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FinanceController::customerInvoices
 * @see app/Http/Controllers/FinanceController.php:32
 * @route '/customer/invoices'
 */
        customerInvoicesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customerInvoices.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    customerInvoices.form = customerInvoicesForm
const FinanceController = { invoices, markPaid, customerInvoices }

export default FinanceController