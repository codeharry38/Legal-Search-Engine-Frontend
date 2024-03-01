<template>
    <v-container fluid>
        <v-row>
            <v-col lg=12 sm=12 md=12>
                <v-chip label color="blue-grey darken-3" dark>
                    <v-icon left small>mdi-sort-variant</v-icon> Edit Act
                </v-chip>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12>
                <v-tabs v-model="ActTabs" color="primary" background-color="transparent" right show-arrows small>
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab>Act Details</v-tab>
                    <v-tab>Act Content</v-tab>
                    <v-tab>Act Notifications</v-tab>
                    <v-tab>Kewords & Tags</v-tab>
                </v-tabs>
                <v-tabs-items v-model="ActTabs">
                    <!-- Act Basic Details Start Here -->
                    <v-tab-item>
                        <v-card outlined tile>
                            <Act :edit="true" :id="currentId"></Act>
                        </v-card>
                    </v-tab-item>
                    <!-- Act Content Data Tabs Start Here -->
                    <v-tab-item>
                        <v-row>
                            <v-col cols=12></v-col>
                        </v-row>
                        <v-row class="mt-5">
                            <v-col cols=8 sm=8 lg=3 md=3>
                                <v-card outlined tile>
                                    <v-sheet class="pa-4 primary">
                                        <v-btn color="red" block class="mb-3 elevation-0" dark @click="createBox=true">Add Content</v-btn>
                                        <v-text-field v-model="search" label="Search for Tree" 
                                        dark flat outlined hide-details clearable clear-icon="mdi-close-circle-outline" dense></v-text-field>
                                    </v-sheet>
                                    <v-treeview :items="TreeRecord" :search="search" item-key="_id" item-text="name" transition
                                        activatable active-class="primary--text" :active.sync="active" style="cursor:pointer" dense hide-details>
                                        <template v-slot:prepend="{ item }">
                                            <span>{{item.recordType[0]}}.</span>
                                            <span>{{item.number}} </span>                                            
                                        </template>                                        
                                    </v-treeview>
                                </v-card>
                            </v-col>
                            <v-col cols=12 sm=12 lg=9 md=9>
                                <v-card outlined tile class="elevation-0" v-if="singleRecord.length == 0">
                                    <v-card-text class="text-xs-center">
                                        <h1 class="display-2 grey--text text--lighten-2">First Select Any Node</h1>
                                    </v-card-text>
                                </v-card>
                                <v-card outlined tile v-else>
                                    <v-toolbar color="primary" flat height="50" tile class="elevation-0" dark>
                                        <b class="title">{{singleRecord.recordType.name}}.{{singleRecord.number}} {{singleRecord.name}}</b>
                                        <v-spacer></v-spacer>
                                        <v-btn color="white" class="mx-1" @click="editBox = true" text fab x-small><v-icon>mdi-pencil</v-icon></v-btn>
                                        <v-btn color="red" class="mx-1" text fab x-small @click="deleteBox=true; deleteType='acttree'"><v-icon>mdi-delete</v-icon></v-btn>
                                    </v-toolbar>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <div v-html="singleRecord.description"></div>
                                    </v-card-text>

                                </v-card>
                            </v-col>
                        </v-row>
                        <v-dialog v-model="createBox" persistent max-width="1200px" min-height="900" transition="dialog-transition">
                            <contentData :actid="currentId" :edit="false"></contentData>
                        </v-dialog>
                        <v-dialog v-model="editBox" persistent max-width="1200px" min-height="900" transition="dialog-transition">
                            <contentData :actid="currentId" :id="selectdeleteId" :edit="true"></contentData>
                        </v-dialog>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
        <!--Delete Diloges -->
        <v-dialog v-model="deleteBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <delConfirm :url="delUrl" :selectedId="selectedId" ></delConfirm>
        </v-dialog>
        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>
    </v-container>
</template>

<script>
//import {SERVER_API} from '../../../API'
import {bus} from '../../../main'
import Act from '../../../components/act/manager/create.vue'
import Config from '../../../config'
import { SERVER_API } from '../../../API'
import delConfirm from '../../../components/confirmation/index.vue'
const contentData = () => import('../../../components/act/manager/content.vue')
export default {
    components:{Act, contentData, delConfirm},
    mounted(){
        this.fetchTree();
    },
    data(){
        return{
            delUrl:'',
            // Tab Intilization
            ActTabs:null,
            currentId:this.$route.params.id,
            //Notification Intialized
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',
            //Dilog Setting
            createBox:false,
            editBox:false,
            deleteBox:false,
            search:'',
            TreeRecord:'',
            active:[],
            singleRecord:"",
            selectedId:"",
            selectdeleteId:"",
            deleteType:""
        }
    },
    created(){
        bus.$on('error', error =>  {
            //alert('s');
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);
        });
        bus.$on('close', data =>{
            if(data == 'contentclose'){
                this.createBox = false;
                this.editBox = false;
            }
            this.deleteBox = false
        });

        bus.$on('response', data =>  {
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
        });          
    },
    watch:{
        active(){
            this.fetchnodedata();
        },
        deleteType(val){
            if(val == 'acttree'){
                this.delUrl = SERVER_API+'/acttree/delete';
            }
        }
    },
    methods:{
        async fetchnodedata(){
            try{
                if (!this.active.length){
                    //
                }
                else{
                    this.selectedId = this.active[0];
                    this.selectdeleteId = this.active[0];
                    const response = await this.$http.get(SERVER_API+'/acttree/findbyid/'+this.active[0]);
                    this.singleRecord = response.data.record;
                }
            }catch(error){
                alert(error);
            }
        },
        async fetchTree(){
            const Response = await this.$http.get(SERVER_API+'/acttree/tree/'+this.currentId);
            this.TreeRecord = Response.data.records;
        }
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
