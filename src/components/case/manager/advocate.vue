<template>
    <v-card>
        <v-app-bar  dark color="blue-grey darken-3" dense flat>
            <v-toolbar-title>
                Attach Advocate
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form @keyup.enter.native="Save()">
            <v-card-text>
                <v-row>
                    <v-col cols=10>
                        <v-autocomplete label="Select Advocate" item-text="name" item-value="_id" 
                        :items="advocateRecords" outlined color="primary" v-model="advocate" dense></v-autocomplete>
                    </v-col>
                    <v-col cols=2>
                        <v-btn color="primary" dark dence small class="my-2" @click="UserBox=true"><v-icon small>mdi-plus</v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols=10>
                        <v-autocomplete label="Select Designation" item-text="name" item-value="_id"
                        :items="desgnRecords" outlined color="primary" v-model="desgn" dense></v-autocomplete>
                    </v-col>
                    <v-col cols=2>
                        <v-btn color="primary" dark dence small class="my-2" @click="DesgnBox=true"><v-icon small>mdi-plus</v-icon></v-btn>
                    </v-col>
                </v-row>
                
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-btn color="blue-grey darken-3" :loading="isLoading" dark class="mx-5" @click="Save()">Save</v-btn>
            </v-card-actions>
        </v-form>
         <!-- Component with Dilog -->
        <!--------------- Court ----------------->
        <v-dialog v-model="UserBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Advocate :edit="false"></Advocate>
        </v-dialog>
        <!--------------- Status ----------------->
        <v-dialog v-model="DesgnBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Desgn :edit="false"></Desgn>
        </v-dialog>
    </v-card>  
</template>

<script>
    import {bus} from '../../../main'
    import Advocate from '../../advocate/advocate.vue'
    import Desgn from '../../advocate/designation.vue'
    import Config from '../../../config'
    import {SERVER_API} from '../../../API'
    export default {
        components:{Advocate,Desgn},
        props:['id'],
        data(){
            return {
                advocate:'',
                desgn:'',
                isLoading:false,
                //Dialog
                UserBox:false,
                DesgnBox:false,
                //Records Holder
                advocateRecords:[],
                desgnRecords:[]
            }
        },
        created(){
            bus.$on('close',() =>  {
                this.UserBox = false;
                this.DesgnBox = false;
            });

            bus.$on('error', error =>  {
                this.notificationBar = true;
                this.notificationColor = 'red';
                this.notificationText = Config.httpError(error);
            });
            bus.$on('response', data =>  {
                if(data.model == 'advocate'){
                    this.newadvocate(data);
                }else if(data.model == 'desgn'){
                    this.newdesgn(data);
                }else{
                    this.notificationBar = true;
                    this.notificationColor = data.res.action == true ? 'black' : 'red';
                    this.notificationText = data.res.message;
                }
            });
        },
        watch:{
            fetchDesignation(){},
            fetchadvocate(){},
        },
        computed:{
            fetchDesignation(){
                return this.fetchdesgn();
            },
            fetchadvocate(){
                return this.fetchAdv();
            }
        },
        methods:{
            // Case advocate Add On 
            newadvocate(data){
                this.notificationBar = true;
                this.notificationColor = data.res.action == true ? 'black' : 'red';
                this.notificationText = data.res.message;
                if(data.type == 'create'){
                    data.res.record == '' ? '' : this.advocateRecords.unshift(data.res.record);
                    this.advocate = data.res.record._id;
                }

            },
            // Case Designation Add On 
            newdesgn(data){
                this.notificationBar = true;
                this.notificationColor = data.res.action == true ? 'black' : 'red';
                this.notificationText = data.res.message;
                if(data.type == 'create'){
                    data.res.record == '' ? '' : this.desgnRecords.unshift(data.res.record);
                    this.desgn = data.res.record._id;
                }
            },
             // fetch Data From components
            //advocate Fetch
            async fetchAdv(){
                try{
                    const Response = await this.$http.get(SERVER_API+'/advocate/records');
                    this.advocateRecords = Response.data.records;
                }catch(error){
                    bus.$emit('error',error);
                }
            },
            async fetchdesgn(){
                try{
                    const Response = await this.$http.get(SERVER_API+'/advocate/desgn/records');
                    this.desgnRecords = Response.data.records;
                }catch(error){
                    bus.$emit('error',error);
                }
            },
            close(){
               this.reset(); 
               bus.$emit('close',{component:'local'});
            },
            reset(){
                this.advocate = '';
                this.desgn = '';
            },
            async Save(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(SERVER_API+'/case/advocate/create',{
                        caseid:this.id,
                        advocate:this.advocate,
                        desgn:this.desgn
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create',model:'caseadvocate'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
        }
    }
</script>

<style>

</style>