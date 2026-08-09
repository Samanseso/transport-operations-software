import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Driver\TaskController::index
 * @see app/Http/Controllers/Driver/TaskController.php:18
 * @route '/tasks'
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
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
export const show = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tasks/{reservation_id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
show.url = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservation_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation_id: args.reservation_id,
                }

    return show.definition.url
            .replace('{reservation_id}', parsedArgs.reservation_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
show.get = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
show.head = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
    const showForm = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
        showForm.get = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Driver\TaskController::show
 * @see app/Http/Controllers/Driver/TaskController.php:35
 * @route '/tasks/{reservation_id}'
 */
        showForm.head = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Driver\TaskController::update
 * @see app/Http/Controllers/Driver/TaskController.php:43
 * @route '/tasks/location'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/tasks/location',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Driver\TaskController::update
 * @see app/Http/Controllers/Driver/TaskController.php:43
 * @route '/tasks/location'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\TaskController::update
 * @see app/Http/Controllers/Driver/TaskController.php:43
 * @route '/tasks/location'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Driver\TaskController::update
 * @see app/Http/Controllers/Driver/TaskController.php:43
 * @route '/tasks/location'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Driver\TaskController::update
 * @see app/Http/Controllers/Driver/TaskController.php:43
 * @route '/tasks/location'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Driver\TaskController::updateStatus
 * @see app/Http/Controllers/Driver/TaskController.php:64
 * @route '/tasks/{reservation_id}/status'
 */
export const updateStatus = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/tasks/{reservation_id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Driver\TaskController::updateStatus
 * @see app/Http/Controllers/Driver/TaskController.php:64
 * @route '/tasks/{reservation_id}/status'
 */
updateStatus.url = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservation_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation_id: args.reservation_id,
                }

    return updateStatus.definition.url
            .replace('{reservation_id}', parsedArgs.reservation_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\TaskController::updateStatus
 * @see app/Http/Controllers/Driver/TaskController.php:64
 * @route '/tasks/{reservation_id}/status'
 */
updateStatus.post = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Driver\TaskController::updateStatus
 * @see app/Http/Controllers/Driver/TaskController.php:64
 * @route '/tasks/{reservation_id}/status'
 */
    const updateStatusForm = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Driver\TaskController::updateStatus
 * @see app/Http/Controllers/Driver/TaskController.php:64
 * @route '/tasks/{reservation_id}/status'
 */
        updateStatusForm.post = (args: { reservation_id: string | number } | [reservation_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, options),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Driver\TaskController::updateWaypointPod
 * @see app/Http/Controllers/Driver/TaskController.php:122
 * @route '/tasks/{reservation_id}/waypoint/{waypoint_index}/pod'
 */
export const updateWaypointPod = (args: { reservation_id: string | number, waypoint_index: string | number } | [reservation_id: string | number, waypoint_index: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWaypointPod.url(args, options),
    method: 'post',
})

updateWaypointPod.definition = {
    methods: ["post"],
    url: '/tasks/{reservation_id}/waypoint/{waypoint_index}/pod',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Driver\TaskController::updateWaypointPod
 * @see app/Http/Controllers/Driver/TaskController.php:122
 * @route '/tasks/{reservation_id}/waypoint/{waypoint_index}/pod'
 */
updateWaypointPod.url = (args: { reservation_id: string | number, waypoint_index: string | number } | [reservation_id: string | number, waypoint_index: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reservation_id: args[0],
                    waypoint_index: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation_id: args.reservation_id,
                                waypoint_index: args.waypoint_index,
                }

    return updateWaypointPod.definition.url
            .replace('{reservation_id}', parsedArgs.reservation_id.toString())
            .replace('{waypoint_index}', parsedArgs.waypoint_index.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\TaskController::updateWaypointPod
 * @see app/Http/Controllers/Driver/TaskController.php:122
 * @route '/tasks/{reservation_id}/waypoint/{waypoint_index}/pod'
 */
updateWaypointPod.post = (args: { reservation_id: string | number, waypoint_index: string | number } | [reservation_id: string | number, waypoint_index: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWaypointPod.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Driver\TaskController::updateWaypointPod
 * @see app/Http/Controllers/Driver/TaskController.php:122
 * @route '/tasks/{reservation_id}/waypoint/{waypoint_index}/pod'
 */
    const updateWaypointPodForm = (args: { reservation_id: string | number, waypoint_index: string | number } | [reservation_id: string | number, waypoint_index: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateWaypointPod.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Driver\TaskController::updateWaypointPod
 * @see app/Http/Controllers/Driver/TaskController.php:122
 * @route '/tasks/{reservation_id}/waypoint/{waypoint_index}/pod'
 */
        updateWaypointPodForm.post = (args: { reservation_id: string | number, waypoint_index: string | number } | [reservation_id: string | number, waypoint_index: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateWaypointPod.url(args, options),
            method: 'post',
        })
    
    updateWaypointPod.form = updateWaypointPodForm
const TaskController = { index, show, update, updateStatus, updateWaypointPod }

export default TaskController