import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/announcements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnnouncementController::index
 * @see app/Http/Controllers/AnnouncementController.php:36
 * @route '/announcements'
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
* @see \App\Http\Controllers\AnnouncementController::store
 * @see app/Http/Controllers/AnnouncementController.php:119
 * @route '/announcements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/announcements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnnouncementController::store
 * @see app/Http/Controllers/AnnouncementController.php:119
 * @route '/announcements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnnouncementController::store
 * @see app/Http/Controllers/AnnouncementController.php:119
 * @route '/announcements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AnnouncementController::store
 * @see app/Http/Controllers/AnnouncementController.php:119
 * @route '/announcements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnnouncementController::store
 * @see app/Http/Controllers/AnnouncementController.php:119
 * @route '/announcements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AnnouncementController::update
 * @see app/Http/Controllers/AnnouncementController.php:149
 * @route '/announcements/{announcement}'
 */
export const update = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/announcements/{announcement}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AnnouncementController::update
 * @see app/Http/Controllers/AnnouncementController.php:149
 * @route '/announcements/{announcement}'
 */
update.url = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'announcement_id' in args) {
            args = { announcement: args.announcement_id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.announcement_id
                : args.announcement,
                }

    return update.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnnouncementController::update
 * @see app/Http/Controllers/AnnouncementController.php:149
 * @route '/announcements/{announcement}'
 */
update.patch = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AnnouncementController::update
 * @see app/Http/Controllers/AnnouncementController.php:149
 * @route '/announcements/{announcement}'
 */
    const updateForm = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnnouncementController::update
 * @see app/Http/Controllers/AnnouncementController.php:149
 * @route '/announcements/{announcement}'
 */
        updateForm.patch = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AnnouncementController::destroy
 * @see app/Http/Controllers/AnnouncementController.php:173
 * @route '/announcements/{announcement}'
 */
export const destroy = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/announcements/{announcement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AnnouncementController::destroy
 * @see app/Http/Controllers/AnnouncementController.php:173
 * @route '/announcements/{announcement}'
 */
destroy.url = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'announcement_id' in args) {
            args = { announcement: args.announcement_id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.announcement_id
                : args.announcement,
                }

    return destroy.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnnouncementController::destroy
 * @see app/Http/Controllers/AnnouncementController.php:173
 * @route '/announcements/{announcement}'
 */
destroy.delete = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AnnouncementController::destroy
 * @see app/Http/Controllers/AnnouncementController.php:173
 * @route '/announcements/{announcement}'
 */
    const destroyForm = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnnouncementController::destroy
 * @see app/Http/Controllers/AnnouncementController.php:173
 * @route '/announcements/{announcement}'
 */
        destroyForm.delete = (args: { announcement: string | { announcement_id: string } } | [announcement: string | { announcement_id: string } ] | string | { announcement_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const announcements = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default announcements