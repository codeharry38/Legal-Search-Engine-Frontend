<template>
    <v-container fluid>
        <v-row>
            <v-col lg=12 sm=12 md=12>
                <v-chip label color="blue-grey darken-3" dark>
                    <v-icon left small>mdi-sort-variant</v-icon> Edit Case
                </v-chip>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12>
                <v-tabs v-model="caseTabs" expanded color="primary" background-color="transparent" right show-arrows class="customTab">
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab>Basics</v-tab>
                    <v-tab>Judges</v-tab>
                    <v-tab>Advocates</v-tab>
                    <v-tab>Case Cited</v-tab>
                    <v-tab>Case Referred</v-tab>
                    <v-tab>Important Note</v-tab>
                    <v-tab>Head Note</v-tab>
                    <v-tab>Judgements</v-tab>
                    <v-tab>Kewords & Tags</v-tab>
                </v-tabs>
                <v-tabs-items v-model="caseTabs">
                    <!------------- Basic Detail Tab Start Here ------------->
                    <v-tab-item>
                        <v-card class="pt-5" outlined tile>
                            <Case :edit="true" :id="currentId"></Case>
                        </v-card>
                    </v-tab-item>
                    <!------------- Basic Detail Tab End Here ------------->

                    <!------------- Judge Tab Start Here ------------->
                    <v-tab-item>
                        <v-card class="pt-5" outlined tile>
                            <!-- Judge Dialog -->
                            <v-dialog v-model="JudgeBox" scrollable persistent max-width="500px" transition="dialog-transition">
                                <Judge :id="currentId"></Judge>
                            </v-dialog>
                            <!-- End Dialog -->
                            <!-- Start Button Tabs -->
                            <v-row>
                                <v-col cols=12>
                                    <v-card-text class="py-0">
                                        <v-btn color="primary" @click="JudgeBox = true" small>Attach Judge</v-btn>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                            <!-- End Button Tabs -->
                            <v-data-table :headers="judgeHeader" :items="judgeRecords" item-key="_id">
                                <template v-slot:[`item.action`]="{ item }">
                                    <v-btn color="red" fab small text @click="deleteBox=true;selectdelete=item._id; deleteType='judge'">
                                        <v-icon small>mdi-window-close</v-icon>
                                    </v-btn>
                                </template> 
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                    <!------------- Judge Tab End Here ------------->

                    <!------------- Advocate Tab Start Here ------------->
                    <v-tab-item>
                        <v-card class="pt-5" outlined tile>
                            <!-- Advocate Dialog -->
                            <v-dialog v-model="AdvocateBox" scrollable persistent max-width="500px" transition="dialog-transition">
                                <Advocate :id="currentId"></Advocate>
                            </v-dialog>
                            <!-- End Dialog -->
                            <!-- Start Button Tabs -->
                            <v-row>
                                <v-col cols=12>
                                    <v-card-text class="py-0">
                                        <v-btn color="primary" @click="AdvocateBox = true" small>Attach Advocate</v-btn>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                            <!-- End Button Tabs -->
                            <v-data-table :headers="advocateHeader" :items="advocateRecords" item-key="_id">
                                <template v-slot:[`item.action`]="{ item }">
                                    <v-btn color="red" fab small text @click="deleteBox=true;selectdelete=item._id; deleteType='advocate'">
                                        <v-icon small>mdi-window-close</v-icon>
                                    </v-btn>
                                </template>                                
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                    <!------------- Advocate Tab End Here ------------->

                    <!------------- Cited Tab Start Here ------------->
                    <v-tab-item>
                        <v-card class="pt-5" outlined tile>
                            <!-- Cited Dialog -->
                            <v-dialog v-model="CitedBox" scrollable persistent max-width="800px" transition="dialog-transition">
                                <Citation :id="currentId"></Citation>
                            </v-dialog>
                            <!-- End Dialog -->
                            <!-- Start Button Tabs -->
                            <v-row>
                                <v-col cols=12>
                                    <v-card-text class="py-0">
                                        <v-btn color="primary" @click="CitedBox = true" small>Attach Cited</v-btn>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                            <!-- End Button Tabs -->
                            <v-data-table :headers="citedHeader" :items="citedRecords" item-key="_id">
                                <template v-slot:[`item.party`]='{item}'>
                                    {{item.petitioner.name}} V. {{item.respondent.name}}
                                </template>
                                 <template v-slot:[`item.status`]='{item}'>
                                    {{item.caseStatus.name}}
                                </template>
                                <template v-slot:[`item.action`]='{item}'>
                                    <v-btn fab color="red" text x-small @click="deleteBox=true;selectdelete=item._id; deleteType='citation'"><v-icon>mdi-close</v-icon></v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                    <!------------- Cited Tab End Here ------------->

                    <!------------- Referred Tab Start Here ------------->
                    <v-tab-item>
                        <v-card class="pt-5" outlined tile>
                            <!-- Referred Dialog -->
                            <v-dialog v-model="ReferredBox" scrollable persistent max-width="800px" transition="dialog-transition">
                                <Referred :id="currentId"></Referred>
                            </v-dialog>
                            <!-- End Dialog -->
                            <!-- Start Button Tabs -->
                            <v-row>
                                <v-col cols=12>
                                    <v-card-text class="py-0">
                                        <v-btn color="primary" @click="ReferredBox = true" small>Attach Referred</v-btn>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                            <!-- End Button Tabs -->
                            <v-data-table :headers="referredHeader" :items="referredRecords" item-key="_id">
                                 <template v-slot:[`item.party`]='{item}'>
                                    {{item.petitioner.name}} V. {{item.respondent.name}}
                                </template>
                                 <template v-slot:[`item.status`]='{item}'>
                                    {{item.caseStatus.name}}
                                </template>
                                <template v-slot:[`item.action`]='{item}'>
                                    <v-btn fab color="red" text x-small @click="deleteBox=true;selectdelete=item._id; deleteType='referred'"><v-icon>mdi-close</v-icon></v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                    <!------------- Referred Tab End Here ------------->

                    <!------------- Important Note Tab Start Here ------------->
                    <v-tab-item>
                         <Importantnote :id="currentId"></Importantnote>
                    </v-tab-item>
                    <!------------- Important Note Tab End Here ------------->

                    <!------------- HeadNote Tab Start Here ------------->
                    <v-tab-item>
                        <v-card class="pt-5" outlined tile>
                            <!-- HeadNote Dialog -->
                            <v-dialog v-model="HeadBox" scrollable persistent max-width="1200px" height="800" transition="dialog-transition">
                                 <HeadNote :parent="currentId"></HeadNote>
                            </v-dialog>
                            <v-dialog v-model="HeadBoxEdit" scrollable persistent max-width="1200px" height="800" transition="dialog-transition">
                                 <HeadNote :parent="currentId" :id="selectedHeadId" :edit="true"></HeadNote>
                            </v-dialog>
                            <!-- End Dialog -->
                            <!-- Start Button Tabs -->
                            <v-row>
                                <v-col cols=12>
                                    <v-card-text class="py-0">
                                        <v-btn color="primary" @click="HeadBox = true" small>New HeadNote</v-btn>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                            <!-- End Button Tabs -->
                            <v-data-table :headers="headHeader" :items="headRecords" item-key="_id">
                                <template v-slot:[`item.sr`]>
                                    {{couter++}}.
                                </template>
                                <template v-slot:[`item.matter`]='{item}'>
                                    <p class="mb-1"><b>{{item.act.name}}</b>,
                                        <span v-if="item.point.length > 0">
                                            <span v-for="(data ,i) in item.point" :key="i"> 
                                                <u><b>{{data.recordType.sName}}.{{data.number}}</b> <i>{{data.name}} </i></u>&nbsp;&nbsp;&nbsp;
                                            </span>
                                        </span>
                                    </p>
                                    <p class="mb-1">{{item.matter}}</p>
                                    <p class="mb-1">{{item.repeatMatter}}</p>
                                </template>
                                <template v-slot:[`item.action`]='{item}'>
                                    <v-btn fab color="primary" class="mx-2" text x-small @click="HeadBoxEdit=true;selectedHeadId=item._id;"><v-icon>mdi-pencil</v-icon></v-btn>
                                    <v-btn fab color="red" class="mx-2" text x-small @click="deleteBox=true;selectdelete=item._id; deleteType='headnote'"><v-icon>mdi-close</v-icon></v-btn>
                                </template>                                
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                    <!------------- HeadNote Tab End Here ------------->

                    <!------------- Judgement Tab Start Here ------------->
                    <v-tab-item>
                        <Judgement :id="currentId"></Judgement>
                    </v-tab-item>
                    <!------------- Judgement Tab End Here ------------->
                </v-tabs-items>                
            </v-col>
        </v-row>
        <!--Delete Diloges -->
        <v-dialog v-model="deleteBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <delConfirm :url="delUrl" :selectedId="selectdelete" ></delConfirm>
        </v-dialog>

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>
    </v-container>
</template>

<script>
//import {SERVER_API} from '../../../API'
import Citation from '../../../components/case/manager/cited.vue'
import Referred from '../../../components/case/manager/referred.vue'
import {bus} from '../../../main'
import Case from '../../../components/case/manager/create.vue'
import Judgement from '../../../components/case/manager/judgement.vue'
import Importantnote from '../../../components/case/manager/importantnote.vue'
import HeadNote from '../../../components/case/manager/headnote.vue'
import Judge from '../../../components/case/manager/judge.vue'
import Advocate from '../../../components/case/manager/advocate.vue'
import Config from '../../../config'
import delConfirm from '../../../components/confirmation/index.vue'
import { SERVER_API } from '../../../API'
//import Editor from '@tinymce/tinymce-vue'
export default {
    components:{Case, Judgement, Judge, Advocate, delConfirm, Citation, Referred, Importantnote, HeadNote},
    mounted(){
        this.fetchJudge();
        this.fetchAdvocate();
        this.fetchCitation();
        this.fetchReferred();
        this.fetchHeadNote();
    },
    watch:{
        deleteType(val){
            if(val == 'advocate'){
                this.delUrl = SERVER_API+'/case/advocate/delete';
            } if(val == 'judge'){
                this.delUrl = SERVER_API+'/case/judge/delete';
            } if(val == 'citation'){
                this.delUrl = SERVER_API+'/case/cited/delete/'+this.currentId;
            } if(val == 'referred'){
                this.delUrl = SERVER_API+'/case/refer/delete/'+this.currentId;
            } if(val == 'headnote'){
                this.delUrl = SERVER_API+'/case/headnote/delete/'+this.currentId;
            }
        }
    },
    data(){
        return{
            couter:1,
            // Dialogs Intialized
            deleteBox:false,
            JudgeBox:false,
            AdvocateBox:false,
            CitedBox:false,
            ReferredBox:false,
            HeadBox:false,
            HeadBoxEdit:false,
            //Tab default Intialized
            caseTabs:null,
            // Current Case Id
            currentId:this.$route.params.id,
            selectedHeadId:'',
            // Notification Intialized
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',
            //Delete Option
            deleteType:'',
            delUrl:'',
            selectdelete:'',

            //TabelHeaders
            judgeHeader:[
                {text:'Name',value:'judge'},
                {text:'Designation',value:'desgn'},
                {text:'Action',value:'action'}
            ],
            advocateHeader:[
                {text:'Name',value:'advocate'},
                {text:'Designation',value:'desgn'},
                {text:'Action',value:'action'}
            ],
            citedHeader:[
                {text:'Petitioner V/S Respondent',value:'party'},
                {text:'Citation',value:'dod'},
                {text:'Status',value:'status'},
                {text:'Action',value:'action'}
            ],
            referredHeader:[
                {text:'Petitioner V/S Respondent',value:'party'},
                {text:'Referred',value:'dod'},
                {text:'Status',value:'status'},
                {text:'Action',value:'action'}
            ],
            headHeader:[
                {text:'Sr No.',value:'sr'},
                {text:'Matter',value:'matter', width:'900px', align:'center'},
                {text:'action',value:'action', align:'right'},
            ],
            //TableRecord
            judgeRecords:[],
            advocateRecords:[],
            citedRecords:[],
            referredRecords:[],
            headRecords:[]
        }
    },
    created(){
        bus.$on('error', error =>  {
            //alert('s');
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);            
        });
        bus.$on('close', data =>  {
            if(data.component == 'local'){
                this.JudgeBox = false;
                this.AdvocateBox = false;
                this.CitedBox = false;
                this.ReferredBox = false;
                this.HeadBox = false;
                this.HeadBoxEdit = false;
            }
            this.deleteBox = false;
        });  
        bus.$on('response', data =>  {
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.model == 'casejudge'){
                    this.newJudge(data);
            }else if(data.model == 'desgn'){
                    this.newAdvocate(data);
            }else if(data.model == 'citation'){
                    this.newCited(data);
            }else if(data.model == 'referred'){
                    this.newReferred(data);
            }else if(data.model == 'headnote'){
                    this.newHeadnote(data);
            }else{
                //
            }
        });
        bus.$on('deleted', () =>  {
            if(this.deleteType == 'judge'){
                this.removeJudge();
            }
            if(this.deleteType == 'advocate'){
                this.removeAdvocate();
            }
            if(this.deleteType == 'citation'){
                this.removeCitation();
            }
            if(this.deleteType == 'referred'){
                this.removeReferred();
            }
            if(this.deleteType == 'headnote'){
                this.removeHeadnote();
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
        //Remove Data
        removeHeadnote(){
            var removeIndex = this.headRecords.map(function(item) { return item._id; }).indexOf(this.selectdelete);
            this.headRecords.splice(removeIndex,1);
        },
        removeAdvocate(){
            var removeIndex = this.advocateRecords.map(function(item) { return item._id; }).indexOf(this.selectdelete);
            this.advocateRecords.splice(removeIndex,1);
        },
        removeJudge(){
            var removeIndex = this.judgeRecords.map(function(item) { return item._id; }).indexOf(this.selectdelete);
            this.judgeRecords.splice(removeIndex,1);
        },
        removeCitation(){
            var removeIndex = this.citedRecords.map(function(item) { return item._id; }).indexOf(this.selectdelete);
            this.citedRecords.splice(removeIndex,1);
        },
        removeReferred(){
            var removeIndex = this.referredRecords.map(function(item) { return item._id; }).indexOf(this.selectdelete);
            this.referredRecords.splice(removeIndex,1);
        },

        //Instent Update
        newHeadnote(data){
            if(data.type == 'create'){
               // data.res.record == '' ? '' : this.headRecords.push(data.res.record);
               this.fetchHeadNote();
            }
            if(data.type == 'update'){
                /*if(data.res.record !='' || data.res.record != null){
                    var foundIndex = this.headRecords.findIndex(x => x._id == data.res.record._id);
                    this.headRecords.splice(foundIndex,1,data.res.record);
                }*/
                this.fetchHeadNote();
            }
        },
        newCited(data){
            if(data.type == 'create'){
                this.fetchCitation();
            }
        },
        newReferred(data){
            if(data.type == 'create'){
                this.fetchReferred();
            }
        },
        newJudge(data){
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.judgeRecords.unshift(data.res.record);
            }
        },
        newAdvocate(data){
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.advocateRecords.unshift(data.res.record);
            }
        },
        //Fetch Attacthed Headnote
        async fetchHeadNote(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/headnote/records/'+this.currentId);
                this.headRecords = Response.data.records;
            }catch(error){
                alert(error);
            }
        },
        //Fetch Attacthed Citation
        async fetchCitation(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/cited/records/'+this.currentId);
                this.citedRecords = Response.data.record.cites;
            }catch(error){
                alert(error);
            }
        },
        //Fetch Attacthed Referred
        async fetchReferred(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/refer/records/'+this.currentId);
                this.referredRecords = Response.data.record.referres;
            }catch(error){
                alert(error);
            }
        },
        //Fetch Attacthed Judge
        async fetchJudge(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/judge/records/'+this.currentId);
                this.judgeRecords = Response.data.records;
            }catch(error){
                alert(error);
            }
        },
        //Fetch Attacthed Advocate
        async fetchAdvocate(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/advocate/records/'+this.currentId);
                this.advocateRecords = Response.data.records;
            }catch(error){
                alert(error);
            }
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
.customTab .v-tab{
    font-size:11px !important;
    color:#000 !important;
}
.customTab .v-tabs-bar{
    height:35px !important;
}
</style>
