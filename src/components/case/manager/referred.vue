<template>
    <v-card>
        <v-app-bar  dark color="blue-grey darken-3" dense flat>
            <v-toolbar-title> Attach Referred </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form>
            <v-card-text>
                <v-row>
                    <v-col cols=12>
                        <treeselect  v-model="referres" :options="CaseEntries" :normalizer="normalizer" :default-expand-level="1" 
                        :flatten-search-results="true" :multiple="true" :async="true" :load-options="LoadCase"/>
                    </v-col>
                </v-row>                
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-btn color="blue-grey darken-3" :loading="isLoading" dark class="mx-5" @click="Save()">Save</v-btn>
            </v-card-actions>
        </v-form>
         <!-- Component with Dilog -->
    </v-card>  
</template>

<script>
    import {Treeselect} from '@riophae/vue-treeselect'
    import {bus} from '../../../main'
    import parseISO from 'date-fns/parseISO'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    //import Config from '../../../config'
    import {SERVER_API} from '../../../API'
    export default {
        components:{Treeselect},
        props:['id'],
        data(){
            return {
                referres:[],
                isLoading:false,
                CaseEntries:[],
                CaseSearch:null,
                normalizer(node) {
                const date = node._source.dod ? parseISO(node._source.dod, {additionalDigits: 2}) : '';
                return { id: node._id, label: node._source.petitioner.name+' V. '+node._source.respondent.name+' Case Number: '+ node._source.caseType.name +' '+ node._source.caseNumber+' of '+node._source.caseYear+' D/d: '+ date }
                }
            }
        },
        methods:{
            async LoadCase({searchQuery, callback }) {
                const Response = await this.$http.post(SERVER_API+'/case/local/search',{query:searchQuery});
                callback(null, Response.data.records)
            },
            close(){
               this.reset(); 
               bus.$emit('close',{component:'local'});
            },
            reset(){
                this.id = '';
                this.referres = [];
            },
            async Save(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(SERVER_API+'/case/refer/create',{
                        id:this.id,
                        referres: this.referres
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create',model:'referred'});
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