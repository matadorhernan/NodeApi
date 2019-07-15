/**
 * COMPLETED ROUTE TESTS ARE 
 *      
 *   Routes
 *     |__ Auth......[Tested]
 *     |    |__login [working][LocalGuard]
 *     |    |__pass  [working] [RegisterGuard] //Sets Password and flags Signed to true
 *     |
 *     |__ User.........[Tested]     
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard] 
 *     |    |__ post D  [Working][TokenGuard,RoleGuard] // admin can generate other admins
 *     |    |__ put  S  [Working][TokenGuard,UserGuard] // modifies users
 *     |    |__ del  S  [Working,Usable??][TokenGuard,UserGuard] //bans users
 *     |    
 *     |__ Team.........[Tested]  
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard]
 *     |    |__ post D  [Working][TokenGuard,RoleGuard]
 *     |    |__ put  S  [Working][TokenGuard,RoleGuard]
 *     |    
 *     |__ Tournament...[Testing]  
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard]
 *     |    |__ post D  [Working][TokenGuard,RoleGuard]
 *     |    |__ put  S  [ Working] without Guards 
 *     |    
 */