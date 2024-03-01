<template>
    <v-container fluid color="#ddd">
        <v-row>
            <v-col lg=6 sm=6 md=6>
                <v-chip label color="blue-grey darken-3" dark>
                    <v-icon left small>mdi-page-layout-sidebar-right</v-icon> Cases
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
                    <router-link :to="{name:'casecreate'}" class="link-text"><v-btn fab dark small color="indigo"><v-icon>mdi-plus</v-icon></v-btn></router-link>
                    <v-btn v-if="selection.length > 0" fab dark small color="red" @click="deleteBox=true">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-speed-dial>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12>
                <v-card class="elevation-0" outlined>
                    <v-card-title>
                        <v-row>
                            <v-col cols=12 sm=12 md=12 class="pa-0 ma-0"></v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table v-model="selection" :headers="header"  :items="records" show-select 
                    item-key="_id" :loading="isLoading" hide-default-footer disable-pagination class="tableTitleCustom" dense>
                        <template v-slot:[`item.petitioner`]="{ item }">
                            <v-tooltip bottom class="infoTooltip">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">{{ item.petitioner.name.substr(0, 23) }} <span v-if="(item.petitioner.name).length > 23"> ... </span> </span>
                                </template>
                                <span>{{item.petitioner.name ?? ''}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.respondent`]="{ item }">
                            <v-tooltip bottom class="infoTooltip">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">{{ item.respondent.name.substr(0, 23) }} <span v-if="(item.respondent.name).length > 23"> ... </span> </span>
                                </template>
                                {{item.respondent.name ?? ''}}
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.court`]="{ item }">
                            <v-tooltip bottom class="infoTooltip">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">{{ item.court.sName ?? '' }} </span>
                                </template>
                                {{item.court.name ?? ''}}
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.CaseNo`]="{ item }">
                            {{item.caseType.name ?? ''}} {{item.caseNumber ?? ''}} Of {{item.caseYear ?? ''}}
                        </template>
                        <template v-slot:[`item.dod`]="{ item }">
                            {{Config.formatedDate(item.dod)}}
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                            <router-link :to="{name:'caseedit', params:{id:item._id}}" class="link-text">
                                <v-btn color="blue-grey darken-3" fab x-small dark text><v-icon>mdi-pencil</v-icon></v-btn>
                            </router-link>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col cols="12">
                <pagination :cPage="currentPage" :lPage="lastPage"></pagination>
            </v-col>
        </v-row>
        <!--Create And Edit Diloges -->
        <!-- Create -->
        <v-dialog v-model="createBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <status :edit="false"></status>
        </v-dialog>
        <!-- Update -->
        <v-dialog v-model="editBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <status :edit="true" :id="selectedId"></status>
        </v-dialog>
        <v-dialog v-model="deleteBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <delConfirm :url="delUrl" :selectedId="deleteconveter" ></delConfirm>
        </v-dialog>

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>
        
    </v-container>
</template>

<script>
import {SERVER_API} from '../../../API'
import {bus} from '../../../main'
import pagination from '../../../components/pagination/index.vue'
import delConfirm from '../../../components/confirmation/index.vue'
import status from '../../../components/case/status.vue'
import Config from '../../../config'
export default {
    components:{status,delConfirm,pagination},
    mounted(){
        this.fetchrecords();
    },
    data(){
        return{
            Config:Config,
            // Dlete Url Is here,
            delUrl:SERVER_API+'/case/delete',
            fab:false,
            header:[
                {text:'Petitioner',value:'petitioner'},
                {text:'Respondent',value:'respondent'},
                {text:'Court',value:'court'},
                {text:'CaseNo',value:'CaseNo'},
                {text:'Date of Decision',value:'dod'},
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
            notificationColor:'black',
            notificationText:'',
            //pagination
            currentPage:1,
            lastPage:'',
            isLoading:true
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
        bus.$on('change-page', data =>  {
            this.currentPage = data;
            this.fetchrecords();
        });
        bus.$on('response', data =>  {
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
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
                this.isLoading =  true;
                const response = await this.$http.get(SERVER_API+'/case/records?page='+this.currentPage);
                this.records = response.data.records;
                this.currentPage = response.data.currentPage;
                this.lastPage = response.data.totalPages;
                this.isLoading =  false;
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