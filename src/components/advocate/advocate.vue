<template>
    <v-card>
        <v-app-bar  dark color="blue-grey darken-3" dense flat>
            <v-toolbar-title class="dialogTitle">
                {{edit == true ? `Edit Advocate` : `New Advocate`}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form @keyup.enter.native="Save()">
            <v-card-text>
                <v-autocomplete v-model="prefix" label="Advocate Title" :items="titles" item-text="prefix" item-value="_id" 
                outlined color="blue-grey darken-3" dense
                ></v-autocomplete>
                <v-text-field v-model="name" label="Advocate Name" outlined color="blue-grey darken-3" dense></v-text-field>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-switch :label="status == true ? 'Active':'Inactive'" v-model="status" color="blue-grey darken-3"></v-switch>
                <v-btn color="blue-grey darken-3" small :loading="isLoading" dark class="mx-5" @click="Save()">Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>  
</template>

<script>
    import {bus} from '../../main'
    import {SERVER_API} from '../../API'
    export default {
        props:['id','edit'],
        data(){
            return {
                prefix:'',
                name:'',
                titles:[],
                status:true,
                isLoading:false,
            }
        },
        watch:{
            checkandfetch(){ 
                //
            },
            fetchtitle(){
                //
            },
        },
        computed:{
            checkandfetch(){
                return this.fetchbyId();
            },
            fetchtitle(){
                return this.title();
            }
        },
        methods:{
            async title(){
                const response = await this.$http.get(SERVER_API+'/salutation/records');
                this.titles = response.data.records;
            },
            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.prefix = '';
                this.name = '';
            },
            async fetchbyId(){
                if(this.edit == true){
                    //alert(this.id);
                    try{
                        
                        const Response = await this.$http.get(SERVER_API+'/advocate/findbyid/'+this.id);
                        this.prefix = Response.data.record.prefix;
                        this.name = Response.data.record.name;
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
                    const Response = await this.$http.post(SERVER_API+'/advocate/create',{
                        prefix:this.prefix,
                        name:this.name,
                        status:this.status
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create',model:'advocate'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(SERVER_API+'/advocate/update',{
                        id:this.id,
                        prefix:this.prefix,
                        name:this.name,
                        status:this.status
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update',model:'advocate'});
                    this.close();
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