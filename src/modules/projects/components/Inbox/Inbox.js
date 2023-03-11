import { defineComponent, onMounted,onUnmounted, ref, watch } from 'vue';
import { useOrders } from '@/modules/projects/composables/orders/useOrders';
import { useMoneyOrdered } from '@/modules/projects/composables/money-ordered/useMoneyOrdered';
import { useUI } from '@/modules/shared/composables/useUI';
import { useRouter } from 'vue-router';
import {AnimatedPlaceholder} from '@/modules/shared/components';



export default defineComponent({
    name: 'Inbox',  
    components:{
        AnimatedPlaceholder
    },
    props:{
        projectId:{
            type:String,
            required: true
        }
    },  
    setup(props) {

        
        const { formatDate, formatAmount, showTooltip, removeTooltip, sortByDate, getStatus } = useUI();        
        const { inboxMoneyOrdered, moneyOrderedQuery } = useMoneyOrdered( props.projectId );       
        const { hasFileProof, getInboxOrders, ordersQuery } = useOrders( props.projectId );

        const router = useRouter();        
        const inboxData = ref([]);          


        watch(getInboxOrders, () => {

            setInboxData();
        });

        watch(inboxMoneyOrdered, () => {          

            setInboxData();
        });

        const setInboxData = () => {

            inboxData.value = [];

            getInboxOrders.value.forEach( order => {
                const data ={
                    type:'Orden de compra',
                    code:order.order_code,
                    date:order.date_created,
                    formatDate:formatDate(order.date_created, true),
                    datePayment:formatDate(order?.date_payment),
                    formatStatus:getStatus(order.status),
                    status:order.status,
                    amount:formatAmount(order.amount),
                    hasProof:hasFileProof(order),
                    itemType:'oc',
                    id:order.order_id
                }

                inboxData.value = [...inboxData.value,data];
            });

           
            inboxMoneyOrdered.value.forEach( request => {
                const data ={
                    type:'Solic. de efectivo',
                    code: request.money_ordered_code,
                    date:request.date,
                    formatDate:formatDate(request.date_created, true),
                    datePayment:'---',
                    formatStatus:getStatus(request.status),
                    status:request.status,
                    amount:formatAmount(request.amount),
                    hasProof:true,
                    itemType:'sc',
                    id:request.money_ordered_id
                }

                inboxData.value = [...inboxData.value,data];
            });
           
            inboxData.value = sortByDate(inboxData.value);
            
          
            
        }


        const onItemClick = (item) => {      
          


            switch (item.itemType) {
                case 'sc':
                    router.push({ name: 'cashflow-history-page', params: { id:item.id, type:'sc' } });    
                    break;
                case 'oc':
                    router.push({ name: 'orders-history-page', params: { id:item.id } });    
                    break;
            
                default:
                    break;
            }       

           

           
        }


        const onWarningOver = (event) => {

            showTooltip('Sin comprobante', event.target);
        }
        const onWarningOut = () => {

            removeTooltip();
        }



        onMounted(async () => {          
          

            setInboxData();

        })

        onUnmounted(() => {
            inboxData.value = [];
        })

        return {
            ordersQuery,
            moneyOrderedQuery,
            formatDate,
            formatAmount,          
            getInboxOrders,           
            onItemClick,
            onWarningOver,
            onWarningOut,
            hasFileProof,
            inboxData
        }
    }
});