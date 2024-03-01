<template>
    <v-card>
        <v-app-bar  dark color="blue-grey darken-3" dense flat>
            <v-toolbar-title> Attach Citation </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form>
            <v-card-text>
                <v-row>
                    <v-col cols=12>
                        <treeselect  v-model="cites" :options="CaseEntries" :normalizer="normalizer" :default-expand-level="1" 
                        :flatten-search-results="true" :multiple="true" :async="true" :load-options="loadOptions"/>
                        <!--<v-autocomplete color="primary"
                        multiple
                        :search-input.sync ="CaseSearch"
                        :loading="isLoading"
                        item-value="_id"
                        item-name="_id"
                        hide-no-data 
                        hide-details
                        prepend-icon="mdi-database-search" 
                        placeholder="Start typing to search" 
                        :items="CaseEntries" 
                        v-model="cites" 
                        outlined label="Cases" 
                        return-object
                        dense>
                        <template slot="item" slot-scope="{ item }">
                            <p><b>{{item._source.respondent.name}} v/s {{item._source.petitioner.name}}</b>,
                            Court: <b>{{item._source.court.name}}</b>,
                            Number: <b>{{item._source.caseType.name}} {{item._source.caseNumber}} of {{item._source.caseYear}}</b>,
                            Status: <b>{{item._source.caseStatus.name}}</b>,
                            </p>
                        </template>
                            <template v-slot:selection="data">
                                {{data}}
                                <template v-if="typeof item !== 'object'">
                                    <v-list-item-content v-text="item"></v-list-item-content>
                                </template>
                                <template v-else>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{item.respondent.name}} V/s {{item.respondent.name}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </template>--
                            </template>
                        </v-autocomplete>-->
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
                cites:[],
                isLoading:false,
                CaseEntries:[],
                CaseSearch:null,
                normalizer(node) {
                const date = node._source.dod ? parseISO(node._source.dod, {additionalDigits: 2}) : '';
                return { id: node._id, label: node._source.petitioner.name+' V. '+node._source.respondent.name+' Case Number: '+ node._source.caseType.name +' '+ node._source.caseNumber+' of '+node._source.caseYear+' D/d: '+ date }
                }
            }
        },
        /*watch:{
            async CaseSearch(val) {
                if(val == '' || val == null){
                    this.isLoading = false;
                }else{
                    this.isLoading = true
                    val == '' ? this.isReLoading = false : this.isReLoading = true;
                    const Response = await this.$http.post(SERVER_API+'/case/local/search',{query:val});
                    if(Response.data.records.length > 0){
                        this.CaseEntries = Response.data.records;
                    }
                    this.isLoading = false;
                }
            
            }
        },*/
        methods:{
            async loadOptions({searchQuery, callback }) {
                const Response = await this.$http.post(SERVER_API+'/case/local/search',{query:searchQuery});
                callback(null, Response.data.records)
            },
            close(){
               this.reset(); 
               bus.$emit('close',{component:'local'});
            },
            reset(){
                this.id = '';
                this.cites = [];
            },
            async Save(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(SERVER_API+'/case/cited/create',{
                        id:this.id,
                        cites: this.cites
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create',model:'citation'});
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