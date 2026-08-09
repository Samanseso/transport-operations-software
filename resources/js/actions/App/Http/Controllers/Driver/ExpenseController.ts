import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/driver/expenses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Driver\ExpenseController::index
 * @see app/Http/Controllers/Driver/ExpenseController.php:16
 * @route '/driver/expenses'
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
* @see \App\Http\Controllers\Driver\ExpenseController::store
 * @see app/Http/Controllers/Driver/ExpenseController.php:32
 * @route '/driver/expenses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/driver/expenses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Driver\ExpenseController::store
 * @see app/Http/Controllers/Driver/ExpenseController.php:32
 * @route '/driver/expenses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\ExpenseController::store
 * @see app/Http/Controllers/Driver/ExpenseController.php:32
 * @route '/driver/expenses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Driver\ExpenseController::store
 * @see app/Http/Controllers/Driver/ExpenseController.php:32
 * @route '/driver/expenses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Driver\ExpenseController::store
 * @see app/Http/Controllers/Driver/ExpenseController.php:32
 * @route '/driver/expenses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const ExpenseController = { index, store }

export default ExpenseController