import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hub',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hub\HubController::index
 * @see app/Http/Controllers/Hub/HubController.php:18
 * @route '/hub'
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
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
export const scan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(options),
    method: 'get',
})

scan.definition = {
    methods: ["get","head"],
    url: '/hub/scan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
scan.url = (options?: RouteQueryOptions) => {
    return scan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
scan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
scan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
    const scanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
        scanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hub\HubController::scan
 * @see app/Http/Controllers/Hub/HubController.php:32
 * @route '/hub/scan'
 */
        scanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scan.form = scanForm
/**
* @see \App\Http\Controllers\Hub\HubController::storeScan
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
export const storeScan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeScan.url(options),
    method: 'post',
})

storeScan.definition = {
    methods: ["post"],
    url: '/hub/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\HubController::storeScan
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
storeScan.url = (options?: RouteQueryOptions) => {
    return storeScan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::storeScan
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
storeScan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeScan.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::storeScan
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
    const storeScanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeScan.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::storeScan
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
        storeScanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeScan.url(options),
            method: 'post',
        })
    
    storeScan.form = storeScanForm
/**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
export const manifests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifests.url(options),
    method: 'get',
})

manifests.definition = {
    methods: ["get","head"],
    url: '/hub/manifests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
manifests.url = (options?: RouteQueryOptions) => {
    return manifests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
manifests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
manifests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manifests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
    const manifestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manifests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
        manifestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manifests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hub\HubController::manifests
 * @see app/Http/Controllers/Hub/HubController.php:86
 * @route '/hub/manifests'
 */
        manifestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manifests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manifests.form = manifestsForm
/**
* @see \App\Http\Controllers\Hub\HubController::storeManifest
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
export const storeManifest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeManifest.url(options),
    method: 'post',
})

storeManifest.definition = {
    methods: ["post"],
    url: '/hub/manifests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\HubController::storeManifest
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
storeManifest.url = (options?: RouteQueryOptions) => {
    return storeManifest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::storeManifest
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
storeManifest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeManifest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::storeManifest
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
    const storeManifestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeManifest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::storeManifest
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
        storeManifestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeManifest.url(options),
            method: 'post',
        })
    
    storeManifest.form = storeManifestForm
const HubController = { index, scan, storeScan, manifests, storeManifest }

export default HubController