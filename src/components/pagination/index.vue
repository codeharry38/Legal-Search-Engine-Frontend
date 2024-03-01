<template>
    <v-pagination
        v-model ="currentPage"
        :length="parseInt(lPage)"
        :total-visible="15"
        @input  ="ChangePage"

    >

    </v-pagination>
</template>
<script>
import {bus} from '../../main'
    export default{
        props:['cPage','lPage'],
        data(){
            return{
                currentPage: this.cPage
            }
        },
        methods:{
            ChangePage(val){
                this.currentPage = val;
                bus.$emit('change-page',val);
            }
        }
    }

</script>
