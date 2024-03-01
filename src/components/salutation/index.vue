<template>
    <v-card>
        <v-app-bar  dark color="blue-grey darken-3" dense flat>
            <v-toolbar-title class="dialogTitle">
                {{edit == true ? `Edit salutation` : `New Salutation`}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form @keyup.enter.native="Save()">
            <v-card-text>
                <v-text-field dense v-model="prefix" label="Salutation Name" outlined color="blue-grey darken-3"></v-text-field>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-switch :label="status == true ? 'Active':'Inactive'" v-model="status" color="blue-grey darken-3"></v-switch>
                <v-btn color="blue-grey darken-3" :loading="isLoading" dark class="mx-5" @click="Save()">Save</v-btn>
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
                status:true,
                isLoading:false,
            }
        },
        watch:{
            checkandfetch(){ 
                //
            }
        },
        computed:{
            checkandfetch(){
                return this.fetchbyId();
            },
        },
        methods:{
            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.prefix = '';
            },
            async fetchbyId(){
                if(this.edit == true){
                    //alert(this.id);
                    try{
                        
                        const Response = await this.$http.get(SERVER_API+'/salutation/findbyid/'+this.id);
                        this.prefix = Response.data.record.prefix;
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
                    const Response = await this.$http.post(SERVER_API+'/salutation/create',{
                        prefix:this.prefix,
                        status:this.status
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(SERVER_API+'/salutation/update',{
                        id:this.id,
                        prefix:this.prefix,
                        status:this.status
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update'});
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