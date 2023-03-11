import { computed, watch, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { getByProject, getOrderDetailByCategories, upload, update, pay, approve, annulate } from '@/modules/projects/services/ordersService';
import { useOrdersStore } from '@/modules/projects/store/orders';
import { useProjectsStore } from '@/modules/projects/store/projects';
import { useProject } from '@/modules/projects/composables/projects/useProject';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';






export const useOrders = (projectId = '') => {


    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const store = useOrdersStore();
    const projectsStore = useProjectsStore();
    
    const { clear } = useAuth();

    const { orders: ordersInStore, currentOrder:storeCurrentOrder, searchResults: storeSearchResults, ordersDetailByCategories: storeOrdersDetailByCategories } = storeToRefs(store);
    const queryClient = useQueryClient();
    const { showMessage, showLoading, substring } = useUI();
    const { currentProject } = useProject();


    const enabledOrdersQuery = ref(false);
    const enabledOrdersDetailByCategoryQuery = ref(false);
    const cacheQueryKey = ref('-');
    const finishQueryCallBack = ref(null);

    if (projectId != '') {
        cacheQueryKey.value = substring(projectId, 10);
        enabledOrdersQuery.value = true;
        enabledOrdersDetailByCategoryQuery.value = true;
    }




    /// GETTERS ///

    const orders = computed(() => ordersInStore.value);
    const currentOrder = computed(() => storeCurrentOrder.value);
    const ordersSearchResults = computed(() => storeSearchResults.value);
    const ordersDetailByCategories = computed(() => storeOrdersDetailByCategories.value);

    const pendingOrders = computed(() => {

        return ordersInStore.value?.filter(order => order.status.toLowerCase() === 'pending').length

    });

    const paidOrders = computed(() => {

        return ordersInStore.value?.filter(order => order.status.toLowerCase() === 'paid').length

    });

    const approveOrders = computed(() => {

        return ordersInStore.value?.filter(order => order.status.toLowerCase() === 'approved').length

    });

    const annulateOrders = computed(() => {

        return ordersInStore.value?.filter(order => order.status.toLowerCase() === 'cancelled').length

    });

    const getInboxOrders = computed(() => {



        const orders = ordersInStore.value?.filter(order => {

            if (order.status.toLowerCase() == 'pending' || (order.status.toLowerCase() == 'paid' && !hasFileProof(order))) {
                return order
            }
        });



        return sortOrdersByPaymentDate(orders);

        }
    );



    /// MUTATIONS ///

    const uploadOrderMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando orden...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setOrders(data.data.orders);

                        store.setOrdersDetailByCategories(data.data.categories_detail);

                        projectsStore.setCurrentProjectBudget(data.data.budget);

                        updateCache();

                        showMessage('Orden cargada', 'success');

                        callFinishCallBack(true);



                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

                            onUnauthorizeRedirect()
                        }

                    }

                }

            },

            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(false);

                showLoading(false);
            },

        }
    );

    const updateOrderMutation = useMutation(
        update,
        {
            onMutate: () => {

                showLoading(true, 'Actualizando orden...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setOrders(data.data);

                        updateCache();

                        showMessage('Orden actualizada', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

                            onUnauthorizeRedirect()
                        }
                    }

                }

            },

            onSettled: () => {
                showLoading(false);
            },
            onError: (error) => {
                showMessage(error.toString(), 'error');

                callFinishCallBack(false);

                showLoading(false);
            },

        }
    );

    const approveOrderMutation = useMutation(
        approve,
        {
            onMutate: () => {
                showLoading(true, 'Aprobando orden...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setOrders(data.data);                      

                        updateCache();

                        showMessage('Orden aprobada', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(true);

                        if (data.status == '401') {

                            onUnauthorizeRedirect()
                        }
                    }

                }

            },
            onSettled: () => {
                console.log('onSettle');
                showLoading(false);
            },

            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(true);

                showLoading(false);
            },

        }
    );

    const payOrderMutation = useMutation(
        pay,
        {
            onMutate: () => {
                showLoading(true, 'Pagando orden...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setOrders(data.data.orders);

                        store.setOrdersDetailByCategories(data.data.categories_detail);

                        projectsStore.setCurrentProjectBudget(data.data.budget);

                        updateCache();

                        showMessage('Orden pagada', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

                            onUnauthorizeRedirect()
                        }
                    }

                }

            },
            onSettled: () => {
                showLoading(false);
            },
            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(false);

                showLoading(false);
            },

        }
    );

    const annulateOrderMutation = useMutation(
        annulate,
        {
            onMutate: () => {
                showLoading(true, 'Anulando orden...');
            },
            onSuccess: (data) => {

                if (data) {

                    if (data.ok) {

                        store.setOrders(data.data.orders);

                        store.setOrdersDetailByCategories(data.data.categories_detail);

                        projectsStore.setCurrentProjectBudget(data.data.budget);

                        updateCache();

                        showMessage('Orden anulada', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

                            onUnauthorizeRedirect()
                        }
                    }

                }

            },
            onSettled: () => {
                showLoading(false);
            },

            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(false);
            },

        }
    );


    /// QUERYS ///

    const ordersQuery = useQuery(
        (cacheQueryKey.value != '-') ? ['orders', { cacheQueryKey }] :  ['orders', '-'],
        () => getByProject(currentProject.value?.project_id),
        {
            enabled: enabledOrdersQuery
        }

    );

    const ordersDetailByCategoryQuery = useQuery(
        (cacheQueryKey.value != '-') ? ['orders-detail-by-category', { cacheQueryKey }] :  ['orders-detail-by-category', '-'],        
        () => getOrderDetailByCategories(currentProject.value?.project_id),
        {
            enabled: enabledOrdersDetailByCategoryQuery
        }

    );



    /// METHODS ///

    const setCurrentOrder = ( id ) =>{
        store.setCurrentOrder( id );  
    }

    const onUnauthorizeRedirect = () => {

        if (route.name != 'login-page') {
            clear();
            router.replace({ name: "login-page" });
        }
    }

    const callFinishCallBack = (val) => {

        if (finishQueryCallBack.value) {

            finishQueryCallBack.value(val);
        }
    }

    const updateCache = () => {

        queryClient.invalidateQueries({
            queryKey: ['orders'],
            exact: false
        });


        queryClient.refetchQueries(
            ['orders'],
            {
                exact: false
            }
        );
        queryClient.invalidateQueries({
            queryKey: ['orders-detail-by-category'],
            exact: false
        });


        queryClient.refetchQueries(
            ['orders-detail-by-category'],
            {
                exact: false
            }
        );

        queryClient.invalidateQueries({
            queryKey: ['project-budget'],
            exact: false
        });
       
    };

    const uploadOrder = (newOrder, callBack) => {

        finishQueryCallBack.value = callBack;

        newOrder.project_id = currentProject.value.project_id;

        uploadOrderMutation.mutate(newOrder);
    };

    const updateOrder = (order, callBack) => {

        finishQueryCallBack.value = callBack;

        updateOrderMutation.mutate(order);
    };

    const approveOrder = (orderId, callBack) => {

        finishQueryCallBack.value = callBack;

        approveOrderMutation.mutate(orderId);
    };

    const payOrder = (order, callBack) => {

        finishQueryCallBack.value = callBack;

        payOrderMutation.mutate(order);
    };

    const annulateOrder = (orderId, callBack) => {

        finishQueryCallBack.value = callBack;

        annulateOrderMutation.mutate(orderId);
    };

    const searchOrders = (query, filters = [], filterTarget = '') => {

        let results = [];


        if (query.length == 0) {

            clearSearchResults();

            if (filters.length > 0 && filterTarget.length > 0) {
                filters.forEach(filter => {
                    results = ordersInStore.value.filter((order) => order[filterTarget].toLowerCase() == filter.toLowerCase());
                });

            }


            store.setSearchResults(results);

            return;
        }


        let byOrderCode = ordersInStore.value.filter(o => {

            const { order_code } = o;

            if ((String(order_code).toLowerCase().includes(String(query).toLowerCase()))) {
                return o;
            }
        });

        let byProductCode = ordersInStore.value.filter(o => {
            const { products } = o;           
            const { product_code } = products[0];            
            if ((String(product_code).toLowerCase().includes(String(query).toLowerCase()))) {
                return o;
            }
        });

        let byCompanyNameStart = ordersInStore.value.filter(o => {
            const { company } = o;
            const { company_name } = company;
            if ((String(company_name).toLowerCase().substring(0, 3).includes(String(query).toLowerCase()))) {
                return o;
            }
        });

        let byCompanyName = ordersInStore.value.filter(o => {
            const { company } = o;
            const { company_name } = company;
            if ((String(company_name).toLowerCase().includes(String(query).toLowerCase()))) {
                return o;
            }
        });

        let byProductNameStart = ordersInStore.value.filter(o => {
            const { products } = o;
            const { product_name } = products[0];
            if ((String(product_name).toLowerCase().substring(0, 3).includes(String(query).toLowerCase()))) {
                return o;
            }
        });

        let byProductName = ordersInStore.value.filter(o => {
            const { products } = o;
            const { product_name } = products[0];
            if ((String(product_name).toLowerCase().includes(String(query).toLowerCase()))) {
                return o;
            }
        });


        let byCategoryNameStart = ordersInStore.value.filter(o => {
            const { category } = o;
            const { category_name } = category;
            if ((String(category_name).toLowerCase().substring(0, 3).includes(String(query).toLowerCase()))) {
                return o;
            }
        });

        let byCategoryName = ordersInStore.value.filter(o => {
            const { category } = o;
            const { category_name } = category;
            if ((String(category_name).toLowerCase().includes(String(query).toLowerCase()))) {
                return o;
            }
        });


        results = results.concat(byOrderCode);
        results = [...new Set([...results, ...byOrderCode])];


        results = results.concat(byCompanyNameStart);
        results = [...new Set([...results, ...byCompanyNameStart])];

        results = results.concat(byCompanyName);
        results = [...new Set([...results, ...byCompanyName])];

        results = results.concat(byCategoryNameStart);
        results = [...new Set([...results, ...byCategoryNameStart])];

        results = results.concat(byCategoryName);
        results = [...new Set([...results, ...byCategoryName])];

        results = results.concat(byProductCode);
        results = [...new Set([...results, ...byProductCode])];

        results = results.concat(byProductNameStart);
        results = [...new Set([...results, ...byProductNameStart])];

        results = results.concat(byProductName);
        results = [...new Set([...results, ...byProductName])];



        if (filters.length > 0 && filterTarget.length > 0) {
            filters.forEach(filter => {
                results.value = results.filter((result) => result[filterTarget].toLowerCase() == filter.toLowerCase());
            });

        }


        store.setSearchResults(results);

    }

    const clearSearchResults = () => {
        store.setSearchResults([]);
    }

    const sortOrdersByPaymentDate = (target) => {

        if (!target) return [];

        return target.sort((a, b) => {

            const nameA = new Date(a.date_payment); // ignore upper and lowercase
            const nameB = new Date(b.date_payment); // ignore upper and lowercase

            // sort in an ascending order
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        })


    }

    const sortOrdersByCode = (target) => {
        return target.sort((a, b) => {

            const nameA = a.category_code; // ignore upper and lowercase
            const nameB = b.category_code; // ignore upper and lowercase

            // sort in an ascending order
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        })


    }

    const hasFileProof = (order) => {

        let hasProof = false;

        if (order.storages) {
            order.storages.forEach(storage => {
                if (storage.type.type_name.toLowerCase() == 'comprobante') {
                    hasProof = true;
                }
            })
        }

        return hasProof;
    }


    /// WATCHES ///

    watch(currentProject, () => {
        if (currentProject.value) {
            cacheQueryKey.value = substring(currentProject.value.project_id, 10);
            enabledOrdersQuery.value = true;
            enabledOrdersDetailByCategoryQuery.value = true;
        }
    });

    watch(ordersQuery.data, () => {

        if (ordersQuery.data.value) {

            if (ordersQuery.data.value.ok) {

                //console.log('Setting orders from query')

                store.setOrders(ordersQuery.data.value.data);

                queryClient.removeQueries({
                    queryKey: ['orders','-'],
                    exact: true
                });

            } else {

                console.log('useOrders error ' + ordersQuery.data.value.error);
                showMessage(ordersQuery.data.value.error, 'error');

                if (ordersQuery.data.value.status == '401') {

                    onUnauthorizeRedirect();
                }
            }

            enabledOrdersQuery.value = false;

        }
    }, { immediate: true });

    watch(ordersDetailByCategoryQuery.data, () => {

        if (ordersDetailByCategoryQuery.data.value) {

            if (ordersDetailByCategoryQuery.data.value.ok) {

                store.setOrdersDetailByCategories(ordersDetailByCategoryQuery.data.value.data);

                queryClient.removeQueries({
                    queryKey: ['orders-detail-by-category','-'],
                    exact: true
                });

            } else {

                console.log('useOrders error ' + ordersDetailByCategoryQuery.data.value.error);
                showMessage(ordersDetailByCategoryQuery.data.value.error, 'error');
            }

            enabledOrdersDetailByCategoryQuery.value = false;

        }
    }, { immediate: true });

    
    return {
        //Properties
        ordersQuery,
        ordersDetailByCategoryQuery,
        uploadOrderMutation,
        updateOrderMutation,
        approveOrderMutation,
        payOrderMutation,
        annulateOrderMutation,

        //Getters
        orders,
        currentOrder,
        ordersDetailByCategories,
        getInboxOrders,
        ordersSearchResults,
        pendingOrders,
        approveOrders,
        paidOrders,
        annulateOrders,


        //Methods
        setCurrentOrder,
        uploadOrder,
        updateOrder,
        approveOrder,
        payOrder,
        annulateOrder,
        searchOrders,
        clearSearchResults,
        sortOrdersByPaymentDate,
        sortOrdersByCode,
        hasFileProof
    }
};

