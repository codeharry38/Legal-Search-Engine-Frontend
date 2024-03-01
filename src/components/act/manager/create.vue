<template>
    <v-form>
        <v-card-text class="mt-5">
            <v-row>
                <v-col sm=12 md=4 cols=12 class="py-0">
                    <v-text-field v-model="name" outlined label="Act Name" dense></v-text-field>
                </v-col>
                <v-col sm=10 md=3 cols=10 class="py-0">
                    <v-autocomplete color="primary" :items="departmentRecord" v-model="department" outlined label="Act Department"
                    item-text="name" item-value="_id" dense></v-autocomplete>
                </v-col>
                <v-col sm=2 md=1 cols=2 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="departmentBox = true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col sm=10 md=3 cols=10 class="py-0">
                    <v-autocomplete color="primary" :items="subjectRecord" v-model="subject" outlined label="Act Subject"
                    item-text="name" item-value="_id" dense></v-autocomplete>
                </v-col>
                <v-col sm=2 md=1 cols=2 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="subjectBox = true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>                
            </v-row>
            <v-row>
                <v-col sm=10 md=3 cols=10 class="py-0">
                    <v-autocomplete color="primary" :items="stateRecord" v-model="state" outlined label="Act Category"
                    item-text="name" item-value="_id" dense></v-autocomplete>
                </v-col>
                <v-col sm=2 md=1 cols=2 class="py-0 text-center">
                    <v-btn color="primary" dark dence small class="my-2" @click="stateBox = true"><v-icon small>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col sm=6 md=4 cols=12 class="py-0">
                    <v-text-field v-model="actNumber" outlined label="Act Number" dense></v-text-field>
                </v-col>
                <v-col sm=6 md=4 cols=12 class="py-0">
                    <v-autocomplete color="primary" :items="years" v-model="actYear" outlined label="Act Year" dense></v-autocomplete>
                </v-col>
                <v-col cols=12 class="py-0">
                    <v-textarea v-model="description" outlined label="Act Description" dense></v-textarea>
                </v-col>
                <v-col cols=12 class="py-0">
                    <v-textarea v-model="gInformation" outlined label="Gazelle Information" dense></v-textarea>
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
        <!--------------- Department ----------------->
        <v-dialog v-model="departmentBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Department :edit="false"></Department>
        </v-dialog>
        <!--------------- Subject ----------------->
        <v-dialog v-model="subjectBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Subject :edit="false"></Subject>
        </v-dialog>
        <!--------------- State ----------------->
        <v-dialog v-model="stateBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <State :edit="false"></State>
        </v-dialog>
        

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>

    </v-form>
</template>

<script>
// Import Component
import Department from '../department.vue'
import State from '../state.vue'
import Subject from '../subject.vue'
// End Component
import {SERVER_API} from '../../../API'
import {bus} from '../../../main'
import format from 'date-fns/format'
import Config from '../../../config'
export default {
    props:['edit','id'],
    components:{Department, State, Subject},
    data(){
        return{
            menu:false,
            name:'',
            state:'',
            subject:'',
            department:'',
            actNumber:'',
            actYear:'',
            gInformation:'',
            description:'',
            dod:'',
            status:false,

            // Data Holder
            departmentRecord:[],
            stateRecord:[],
            subjectRecord:[],
            //Loading 
            isLoading:false,
            //Component Box
            departmentBox:false,
            stateBox:false,
            subjectBox:false,
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',

        }
    },
    created(){
        bus.$on('close',() =>  {
            this.departmentBox = false;
            this.stateBox = false;
            this.subjectBox = false;
        });

        bus.$on('error', error =>  {
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);
        });
        bus.$on('response', data =>  {
            if(data.model == 'department'){
                this.newDepartment(data);
            }else if(data.model == 'subject'){
                this.newSubject(data);
            }else if(data.model =='state'){
                this.newState(data);
            }else{
                this.notificationBar = true;
                this.notificationColor = data.res.action == true ? 'black' : 'red';
                this.notificationText = data.res.message;
            }
        });
        
    },
    watch: {
        checkandFetch() {
            // Just Checking Computed For fething data;;;;
        }
    },
    computed:{
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
        this.fetchDepartment();
        this.fetchSubject();
        this.fetchState();
    },
    methods:{
        // Department Add On 
        newDepartment(data){
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.departmentRecord.unshift(data.res.record);
                this.department = data.res.record._id;
            }
        },
        // Subject Add On 
        newSubject(data){
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.subjectRecord.unshift(data.res.record);
                this.subject = data.res.record._id;
            }
        },
        // State Add On
        newState(data){
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.stateRecord.unshift(data.res.record);
                this.state = data.res.record._id;
            }
        },
        // fetch Data From components
        //Court Fetch
        async fetchDepartment(){
            try{
                const Response = await this.$http.get(SERVER_API+'/act/department/records');
                this.departmentRecord = Response.data.records;
            }catch(error){
                bus.$emit('error',error);
            }
        },
        //Status Fetch
        async fetchSubject(){
            try{
                const Response = await this.$http.get(SERVER_API+'/act/subject/records');
                this.subjectRecord = Response.data.records;
            }catch(error){
                bus.$emit('error',error);
            }
        },
        //Type Fetch
        async fetchState(){
            try{
                const Response = await this.$http.get(SERVER_API+'/act/state/records');
                this.stateRecord = Response.data.records;
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
                    
                    const Response = await this.$http.get(SERVER_API+'/act/findbyid/'+this.id);
                    this.name = Response.data.record.name;
                    this.state = Response.data.record.state;
                    this.subject = Response.data.record.subject;
                    this.department = Response.data.record.department;
                    this.actNumber = Response.data.record.actNumber;
                    this.actYear = Response.data.record.actYear;
                    this.gInformation = Response.data.record.gInformation;
                    this.description = Response.data.record.description;
                    this.dod = Response.data.record.dod;
                    this.status = Response.data.record.status;
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
                const Response = await this.$http.post(SERVER_API+'/act/create',{
                    name: this.name,
                    state: this.state,
                    subject: this.subject,
                    department: this.department,
                    actNumber: this.actNumber,
                    actYear: this.actYear,
                    gInformation: this.gInformation,
                    description: this.description,
                    dod: this.dod,
                    status: this.status,
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'create', model:'act'});
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        },
        async update(){
            try{
                this.isLoading = true;
                const Response = await this.$http.put(SERVER_API+'/act/update',{
                    id:this.id,
                    name: this.name,
                    state: this.state,
                    subject: this.subject,
                    department: this.department,
                    actNumber: this.actNumber,
                    actYear: this.actYear,
                    gInformation: this.gInformation,
                    description: this.description,
                    dod: this.dod,
                    status: this.status,
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'update', model:'act'});
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