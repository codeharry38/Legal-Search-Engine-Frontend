import Dashboard from '../views/dashboard.vue'
// Independent with components
import Court from '../views/court.vue'
import Party from '../views/party.vue'
import Salutation from '../views/salutation.vue'

// Judge
import Judge from '../views/judge/judge.vue'
import Judgedesgn from '../views/judge/designation.vue'

// Advocate
import Advocate from '../views/advocate/advocate.vue'
import Advocatedesgn from '../views/advocate/designation.vue'

// Books
import Book from '../views/book.vue'


// ---------Case---------------
    import Case from '../views/casemanager/case/index.vue'
    import CaseEdit from '../views/casemanager/case/edit.vue'
    import CaseCreate from '../views/casemanager/case/create.vue'
    //case type
    import CaseType from '../views/casemanager/casetype.vue'
    // case status
    import CaseStatus from '../views/casemanager/casestatus.vue'
// ----------ACT ----------------
    import Act from '../views/actmanager/act/index.vue'
    import ActEdit from '../views/actmanager/act/edit.vue'
    import ActCreate from '../views/actmanager/act/create.vue'
    //Section
    import Section from '../views/actmanager/section.vue'
    import Subject from '../views/actmanager/subject.vue'
    import Department from '../views/actmanager/department.vue'
    import State from '../views/actmanager/state.vue'

//---------- News ------------
    import News from '../views/newmanager/index.vue'
    import NewsEdit from '../views/newmanager/edit.vue'
    import NewsCreate from '../views/newmanager/create.vue'

//--------- Users ------------
    import User from '../views/usermanager/user/index.vue'
    //import UserEdit from '../views/usermanager/user/edit.vue'
    //import UserCreate from '../views/usermanager/user/create.vue'


// Login Logout
import Login from '../views/login.vue'
import Logout from '../views/logout.vue'


export default [
    {path:'/', component:Dashboard, name:'dashboard'},
    // Independent with  components
    {path:'/court', component:Court, name:'court'},
    {path:'/party', component:Party, name:'party'},
    {path:'/salutation', component:Salutation, name:'salutation'},
    // Judge
    {path:'/judge', component:Judge, name:'judge'},
    {path:'/judge/designation', component:Judgedesgn, name:'judgedesgn'},
    // Advocate
    {path:'/advocate', component:Advocate, name:'advocate'},
    {path:'/advocate/designation', component:Advocatedesgn, name:'advocatedesgn'},
    // Books
    {path:'/book', component:Book, name:'book'},
    // -------------CASE-------------
    {path:'/case', component:Case, name:'case'},
    {path:'/case/edit/:id', component:CaseEdit, name:'caseedit'},
    {path:'/case/create', component:CaseCreate, name:'casecreate'},
    // Case Status
    {path:'/case/status', component:CaseType, name:'casetype'},
    // Case Type
    {path:'/case/type', component:CaseStatus, name:'casestatus'},

    // -------------ACT-------------
    {path:'/act', component:Act, name:'act'},
    {path:'/act/edit/:id', component:ActEdit, name:'actedit'},
    {path:'/act/create', component:ActCreate, name:'actcreate'},
    // ACT Section
    {path:'/act/section', component:Section, name:'actsection'},
    // Act Subject
    {path:'/act/subject', component:Subject, name:'actsubject'},
    // Act Department
    {path:'/act/department', component:Department, name:'actdepartment'},
    // Act State
    {path:'/act/state', component:State, name:'actstate'},

    // ------------ NEWS --------------
    {path:'/news', component:News, name:'news'},
    {path:'/news/edit/:id', component:NewsEdit, name:'newsedit'},
    {path:'/news/create', component:NewsCreate, name:'newscreate'},

    // ------------ USER --------------
    {path:'/user', component:User, name:'user'},
    //{path:'/user/edit/:id', component:UserEdit, name:'useredit'},
    //{path:'/user/create', component:UserCreate, name:'usercreate'},

    // Login And Logout
    {path:'/login', component:Login, name:'login'},
    {path:'/logout', component:Logout, name:'logout'}
]