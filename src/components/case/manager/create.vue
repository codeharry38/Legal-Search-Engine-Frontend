<template>
    <v-form>
        <v-card-text>
            <v-row>
                <v-col sm=8 md=3 cols=9 class="py-0">
                    <v-autocomplete color="primary" :items="courtRecord" v-model="court" outlined label="Court"
                    item-text="name" item-value="_id" dense></v-autocomplete>
                </v-col>
                <v-col sm=4 md=1 cols=3 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="CourtBox = true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-0">
                    <p class="font-weight-bold">Case Number</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col sm=8 md=3 cols=9 class="py-0">
                    <v-autocomplete color="primary" :items="typeRecord" v-model="caseType" outlined label="Case Type" 
                    item-text="name" item-value="_id" dense></v-autocomplete>
                </v-col>
                <v-col sm=4 md=1 cols=3 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="TypeBox=true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col sm=8 md=3 cols=9 class="py-0">
                    <v-text-field color="primary" v-model="caseNumber" outlined label="Case Number" dense></v-text-field>
                </v-col>
                <v-col sm=4 md=1 cols=9 class="py-0 text-center">
                    <p class="mb-0 mt-2" :hidden="$vuetify.breakpoint.smAndDown">OF</p>
                </v-col>
                <v-col sm=8 md=3 cols=9 class="py-0">
                    <v-autocomplete color="primary" :items="years" v-model="caseYear" outlined label="Case Year" dense></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-0">
                    <p class="font-weight-bold">Case Party</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col sm=8 md=3 cols=9 class="py-0">
                    <v-autocomplete color="primary"
                        :search-input.sync ="PetitionerSearch"
                        :loading="isPeLoading"
                        item-text="name"
                        item-value="_id"
                        prepend-icon="mdi-database-search" 
                        placeholder="Start typing to Search" 
                        :items="PetitionerData" 
                        v-model="petitioner" 
                        outlined label="Petitioner" 
                        return-object
                        dense>
                        <template v-if="petitioner !=''" v-slot:append-outer>
                            <v-slide-x-reverse-transition>
                                <v-icon @click="PetitionerSearch='';EmptyPet;">mdi-cancel</v-icon>
                            </v-slide-x-reverse-transition>
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col sm=8 md=1 col=9 class="py-0 text-center">
                    <p class="mb-0 mt-2 font-weight-bold" :hidden="$vuetify.breakpoint.smAndDown">V/S</p>
                </v-col>
                <v-col sm=8 md=3 cols=9 class="py-0">
                    <v-autocomplete color="primary"
                        :search-input.sync ="RespondentSearch"
                        :loading="isReLoading"
                        item-text="name"
                        item-value="_id"
                        prepend-icon="mdi-database-search" 
                        placeholder="Start typing to Search"
                        :items="RespondentData"
                        v-model="respondent"
                        outlined label="Respondent"
                        return-object
                        @click:append-outer="respondent=null"
                        dense>
                        <template v-if="respondent !=''" v-slot:append-outer>
                            <v-slide-x-reverse-transition>
                                <v-icon @click="EmptyRes">mdi-cancel</v-icon>
                            </v-slide-x-reverse-transition>
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols=3 sm=4 md=1 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="PartyBox=true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-0">
                    <p class="font-weight-bold">Case Status and Date of Decision</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols=9 sm=8 md=3 class="py-0">
                    <v-autocomplete color="primary" :items="statusRecord" v-model="caseStatus" outlined label="Case Status"
                    item-text="name" item-value="_id" dense></v-autocomplete>
                </v-col>
                <v-col sm=4 md=1 cols=3 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="StatusBox=true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col cols=9 sm=8 md=3 class="py-0">
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="dod" transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="dod" dense outlined label="Date of Decision" append-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="dod" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="menu = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.menu.save(dod)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar color="primary" flat height="50">
            <v-spacer></v-spacer>
            <v-switch :label="status == true ? 'Active': 'Inactive'" v-model="status" dark class="mt-5 mx-5" color="white"></v-switch>
            <v-btn color="white" :loading="isLoading" @click="Save()" >Save</v-btn>            
        </v-toolbar>
        <!-- Component with Dilog -->
        <!--------------- Court ----------------->
        <v-dialog v-model="CourtBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Court :edit="false"></Court>
        </v-dialog>
        <!--------------- Status ----------------->
        <v-dialog v-model="StatusBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Status :edit="false"></Status>
        </v-dialog>
        <!--------------- Type ----------------->
        <v-dialog v-model="TypeBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Type :edit="false"></Type>
        </v-dialog>
        <!--------------- Party ----------------->
        <v-dialog v-model="PartyBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Party :edit="false"></Party>
        </v-dialog>
        

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>

    </v-form>
</template>

<script>
// Import Component
import Court from '../../court/index.vue'
import Status from '../status.vue'
import Type from '../type.vue'
import Party from '../../party/index.vue'
// End Component
import {SERVER_API} from '../../../API'
import {bus} from '../../../main'
import format from 'date-fns/format'
import Config from '../../../config'
export default {
    props:['edit','id'],
    components:{Court, Status, Type,Party},
    data(){
        return{
            menu:false,
            court:'',
            caseType:'',
            caseNumber:'',
            caseYear:'',
            petitioner:'',
            respondent:'',
            dod:'',
            caseStatus:'',
            status:false,

            // Data Holder
            courtRecord:[],
            typeRecord:[],
            statusRecord:[],
            //Loading 
            isLoading:false,
            isReLoading:false,
            isPeLoading:false,
            //Component Box
            CourtBox:false,
            TypeBox:false,
            StatusBox:false,
            PartyBox:false,
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',
            //Search And Data Holder
            nameLimit: 60,
            RespondentEntries:[],
            PetitionerEntries:[],
            RespondentSearch:null,
            PetitionerSearch:null,

        }
    },
    created(){
        bus.$on('close',() =>  {
            this.CourtBox = false;
            this.TypeBox = false;
            this.StatusBox = false;
            this.PartyBox = false;
        });

        bus.$on('error', error =>  {
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);
        });
        bus.$on('response', data =>  {
            if(data.model == 'court'){
                this.newCourt(data);
            }else if(data.model == 'status'){
                this.newStatus(data);
            }else if(data.model =='type'){
                this.newType(data);
            }else{
                this.notificationBar = true;
                this.notificationColor = data.res.action == true ? 'black' : 'red';
                this.notificationText = data.res.message;
            }
        });
        
    },
    watch: {
        async RespondentSearch(val) {   
            //console.log(val);
            if(this.respondent == ''){
                val == '' ? this.isReLoading = false : this.isReLoading = true;
                const Response = await this.$http.post(SERVER_API+'/party/search',{query:val});
                this.RespondentEntries = Response.data.records;
                this.isReLoading = false;
            }else{
                this.isReLoading = false
            }
            
        },
        async PetitionerSearch(val) {
            if(this.petitioner == ''){
                val == '' ? this.isPeLoading = false : this.isPeLoading = true;
                const Response = await this.$http.post(SERVER_API+'/party/search',{query:val});
                this.PetitionerEntries = Response.data.records;
                this.isPeLoading = false;
            }else{
                this.isPeLoading = false
            }            
        },
        checkandFetch() {
            // Just Checking Computed For fething data;;;;
        }
    },
    computed:{
        // Create record
        RespondentData () {
            return this.RespondentEntries.map(entry => {
            const name = entry.name.length > this.nameLimit
                ? entry.name.slice(0, this.nameLimit) + '...'
                : entry.name

            return Object.assign({}, entry, { name })
            })
        },
        PetitionerData () {
            return this.PetitionerEntries.map(entry => {
            const name = entry.name.length > this.nameLimit
                ? entry.name.slice(0, this.nameLimit) + '...'
                : entry.name

            return Object.assign({}, entry, { name })
            })
        },
        years(){
            var date = new Date();
            var years = [];
            for(let i = date.getUTCFullYear(); i >= 1850; --i){
                years.push(i);
            }
            return years;
        },
        Dateformatted(){
            return this.dod ? format(this.dod, 'DD/MM/YYYY') : '';
        },
        checkandFetch(){
            return this.fetchbyId();
        }
    },
    mounted(){
        this.fetchCourt();
        this.fetchStatus();
        this.fetchType();
    },
    methods:{
        // Component AddOn
        // Court Add On
        EmptyRes(){
            this.RespondentSearch = ''
            this.respondent = '';            
        },
        EmptyPet(){
            this.PetitionerSearch = ''
            this.petitioner = '';            
        },
        newCourt(data){
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.courtRecord.unshift(data.res.record);
                this.court = data.res.record._id;
            }
        },
        // Case Type Add On 
        newType(data){
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.typeRecord.unshift(data.res.record);
                this.caseType = data.res.record._id;
            }

        },
        // Case Status Add On
        newStatus(data){
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.statusRecord.unshift(data.res.record);
                this.caseStatus = data.res.record._id;
            }
        },
        // fetch Data From components
        //Court Fetch
        async fetchCourt(){
            try{
                const Response = await this.$http.get(SERVER_API+'/court/records');
                this.courtRecord = Response.data.records;
            }catch(error){
                bus.$emit('error',error);
            }
        },
        //Status Fetch
        async fetchStatus(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/status/records');
                this.statusRecord = Response.data.records;
            }catch(error){
                bus.$emit('error',error);
            }
        },
        //Type Fetch
        async fetchType(){
            try{
                const Response = await this.$http.get(SERVER_API+'/case/type/records');
                this.typeRecord = Response.data.records;
            }catch(error){
                bus.$emit('error',error);
            }
        },
        close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
        },
        reset(){
                this.sName = '';
                this.name = '';
        },
        async fetchbyId(){
            if(this.edit == true){
                //alert(this.id);
                try{
                    
                    const Response = await this.$http.get(SERVER_API+'/case/findbyid/'+this.id);
                    this.court = Response.data.record.court
                    this.caseType = Response.data.record.caseType
                    this.caseNumber = Response.data.record.caseNumber
                    this.caseYear = Response.data.record.caseYear
                    this.petitioner = Response.data.record.petitioner
                    this.respondent = Response.data.record.respondent
                    this.dod = Config.formFormatedDate(Response.data.record.dod)
                    this.caseStatus = Response.data.record.caseStatus
                    this.status = Response.data.record.status
                }catch(error){
                    bus.$emit('error',error);
                }
            }
        },
        Save(){
            this.edit == true ? this.update() : this.create();
        },
        async create(){
            try{
                this.isLoading = true;
                const Response = await this.$http.post(SERVER_API+'/case/create',{
                    court:this.court,
                    caseType:this.caseType,
                    caseNumber:this.caseNumber,
                    caseYear:this.caseYear,
                    petitioner:this.petitioner,
                    respondent:this.respondent,
                    dod:this.dod,
                    caseStatus:this.caseStatus,
                    status:this.status,
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'create'});
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        },
        async update(){
            try{
                this.isLoading = true;
                const Response = await this.$http.put(SERVER_API+'/case/update',{
                    id:this.id,
                    court:this.court,
                    caseType:this.caseType,
                    caseNumber:this.caseNumber,
                    caseYear:this.caseYear,
                    petitioner:this.petitioner,
                    respondent:this.respondent,
                    dod:this.dod,
                    caseStatus:this.caseStatus,
                    status:this.status,
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'update'});
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        }
    }

}
</script>

<style>

</style>