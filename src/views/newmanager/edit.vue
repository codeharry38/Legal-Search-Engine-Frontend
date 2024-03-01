<template>
<v-container fluid>
        <v-row>
            <v-col lg=12 sm=12 md=12>
                <v-chip label color="blue-grey darken-3" dark>
                    <v-icon left small>mdi-sort-variant</v-icon> Edit Update
                </v-chip>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12>
                <v-card outlined>
                    <News :edit="true" :id="currentId"></News>
                </v-card>
            </v-col>
        </v-row>

        <!-- Notifications -->
        <!--<v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>-->
    </v-container>
</template>

<script>
//import {SERVER_API} from '../../../API'
import {bus} from '../../main'
import News from '../../components/news/news.vue'
import Config from '../../config'
//import { SERVER_API } from '../../API'
export default {
    components:{News},
    mounted(){
        //this.fetchTree();
    },
    data(){
        return{
            currentId:this.$route.params.id,
            //Notification Intialized
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',
        }
    },
    created(){
        bus.$on('error', error =>  {
            //alert('s');
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);
        });

        bus.$on('response', data =>  {
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
        });          
    },
    methods:{
        
    }
}
</script>

<style>
.v-speed-dial__list{
    left:auto !important;
    right:50px !important
}
.mt-70{
    margin-top:10%;
}
.link-text{
    text-decoration: none;
}
.v-treeview-node__root{
    min-height: 30px !important;
}
.v-treeview-node__content{
    font-weight: bold;
    font-size:12px;
    text-transform: uppercase;
}
.v-treeview-node__content .v-treeview-node__label{
    line-height: 10px;
    font-weight: normal !important;
    font-size:13px;
    text-transform:capitalize !important;
}
</style>
