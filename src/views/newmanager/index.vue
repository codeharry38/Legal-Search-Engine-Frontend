<template>
    <v-container fluid>
        <v-row>
            <v-col lg=6 sm=6 md=6>
                <v-chip label color="blue-grey darken-3" dark>
                    <v-icon left small>mdi-page-layout-sidebar-right</v-icon> News
                </v-chip>
            </v-col>
            <v-col lg=6 sm=6 md=6 class="text-right">
                <v-speed-dial v-model="fab" :right="true" direction="left" :open-on-hover="true" transition="slide-y-reverse-transition">
                    <template v-slot:activator>
                        <v-btn v-model="fab" color="blue-grey darken-3" dark fab small>
                            <v-icon v-if="fab">mdi-close</v-icon>
                            <v-icon v-else>mdi-note-text</v-icon>
                        </v-btn>
                    </template>
                    <router-link :to="{name:'newscreate'}" class="link-text"><v-btn fab dark small color="indigo"><v-icon>mdi-plus</v-icon></v-btn></router-link>
                    <v-btn v-if="selection.length > 0" fab dark small color="red" @click="deleteBox=true">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-speed-dial>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12>
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols=12 sm=6 md=8 class="pa-0 ma-0"></v-col>
                            <v-col cols=12 sm=6 md=4 class="py-0 my-0">
                                <v-text-field color="blue-grey darken-3" v-model="search" append-icon="mdi-magnify" label="Search" outlined hide-details dense></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table v-model="selection" :headers="header"  :items="records" show-select 
                    item-key="_id" loading="true" :search="search">
                        <template v-slot:[`item.title`]="{ item }">
                            <v-tooltip bottom class="infoTooltip">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">{{ item.title.substr(0, 30) }} <span v-if="item.title.length > 30"> ... </span> </span>
                                </template>
                                <span>{{ item.title}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.status`]="{ item }">
                            <v-chip label dark class="mx-1" :color="item.status == true ? 'green':'red'" x-small>{{item.status == true ? 'Active' : 'Inactive'}}</v-chip>
                        </template>
                        <template v-slot:[`item.createdAt`]="{ item }">
                            <span>{{ item.createdAt}}</span>
                        </template>
                        <template v-slot:[`item.updateAt`]="{ item }">
                            <span>{{ item.updateAt}}</span>
                        </template>

                        
                        <template v-slot:[`item.action`]="{ item }">
                            <router-link :to="{name:'newsedit', params:{id:item._id}}" class="link-text">
                                <v-btn color="blue-grey darken-3" fab small dark text><v-icon>mdi-pencil</v-icon></v-btn>
                            </router-link>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <!--Create And Edit Diloges -->
        <v-dialog v-model="deleteBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <delConfirm :url="delUrl" :selectedId="deleteconveter" ></delConfirm>
        </v-dialog>

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top right :color="notificationColor" multi-line class="notificationCustomBar"> {{ notificationText }} 
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="notificationBar = false" >Close</v-btn>
            </template>
        </v-snackbar>
        
    </v-container>
</template>

<script>
import {SERVER_API} from '../../API'
import {bus} from '../../main'
import delConfirm from '../../components/confirmation/index.vue'
import Config from '../../config'
export default {
    components:{delConfirm},
    mounted(){
        this.fetchrecords();
    },
    data(){
        return{
            // Dlete Url Is here
            delUrl:SERVER_API+'/news/delete',
            fab:false,
            header:[
                {text:'Title',value:'title'},
                {text:'Publish On',value:'createdAt'},
                {text:'Last Update',value:'updatedAt'},
                {text:'Action',value:'action',sortable:false},
            ],
            // Diloge Setting
            createBox:false,
            editBox:false,
            deleteBox:false,
            // Selection of Data
            selection:[],
            records:[],
            // Others
            selectedId:'',
            loading:false,
            search:'',
            //Notifications
            notificationBar:false,
            notificationColor:'#333',
            notificationText:''
        }
    },
    created(){
        bus.$on('close',() =>  {
            this.createBox = false;
            this.editBox = false;
            this.deleteBox = false;
            this.selection = [];
        });

        bus.$on('error', error =>  {
            //alert('s');
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);
        });

        bus.$on('response', data =>  {
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? '#333' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.records.unshift(data.res.record);
            }else{
                if(data.res.recordv !='' || data.res.recordv != null){
                    var foundIndex = this.records.findIndex(x => x._id == data.res.record._id);
                    this.records.splice(foundIndex,1,data.res.record);
                }
            }
        });

        bus.$on('deleted', () =>  {
            for(let i = 0; i < this.selection.length; i++){
                if(this.records.indexOf(this.selection[i])!= -1){
                    this.records.splice(this.records.indexOf(this.selection[i]),1);
                }
            }
        });            
    },
    computed:{
        deleteconveter(){
            var deleteId = [...new Set(this.selection.map(it => it._id))];
            return deleteId.toString();
        }
    },
    methods:{
        async fetchrecords(){
            try{
                const response = await this.$http.get(SERVER_API+'/news/records');
                this.records = response.data.records;
            }catch(error){
                bus.$emit('error',error);
            }
        },
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
</style>