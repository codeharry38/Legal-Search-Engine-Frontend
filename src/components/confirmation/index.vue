<template>
    <span>
        <v-card loader-height="3" :loading="isLoading" tile>
            <v-app-bar  dark color="blue-grey darken-3" dense flat>
                <v-toolbar-title>Would you like to delete ?</v-toolbar-title>
            </v-app-bar>
            <v-card-text class="my-5 py-5" style="text-align:center">
                <p v-if="message == ''" class="my-0">Selected Items {{(selectedId.match(/,/g) || []).length+1}}</p>
                <p class="my-0" v-else>
                    <v-icon size="90" color="green" class="ma-0">mdi-checkbox-marked-outline</v-icon><br>
                    {{message}}
                </p>
            </v-card-text>
            <v-card-actions v-if="message == ''" class="text--center">
                <v-spacer></v-spacer>
                <v-btn color="green" text :loading="isLoading" class="mx-2" @click="deldata()">Yes</v-btn>
                <v-btn color="red" text dark class="mx-2" @click="close()">No</v-btn>
            </v-card-actions>
            <v-card-actions v-else class="text--center">
                <v-spacer></v-spacer>
                <v-btn color="blue-grey darken-3" text :loading="isLoading" class="mx-2" @click="close()">Ok</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </span>
</template>

<script>
import {bus} from '../../main'
export default {
    props:['url','selectedId','live'],
    data(){
        return{
            isLoading:false,
            //url:'',
            message:'',
            //selectedId:''
        }
    },
    methods:{
        close(){
            this.isLoading = false;
            this.url = '';
            this.message = '';
            this.selectedId = '';
            bus.$emit('close',false);

        },
        async deldata(){
            try{
                this.isLoading = true;
                let del_ids = this.selectedId;
                const response = await this.$http.delete(this.url+'/'+del_ids);
                this.message = response.data.message;
                this.isLoading = false;
                bus.$emit('deleted',false)
                this.isLoading = false;
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