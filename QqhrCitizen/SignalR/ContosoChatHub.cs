using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace QqhrCitizen.SignalR
{
    public class ContosoChatHub : Hub
    {
        public void NewContosoChatMessage(string name, string message,string cid)
        {
           // Clients.All.addContosoChatMessageToPage(name, message);
            Clients.Group(cid).addContosoChatMessageToPage(name, message);
        }

        public async Task JoinGroup(string groupname)
        {
            await Groups.Add(Context.ConnectionId, groupname);
           // Clients.Group(groupname).addGroupToShow(Context.ConnectionId + "add to group");
        }

        public async Task LeaveGroup(string groupname)
        {
            await Groups.Remove(Context.ConnectionId, groupname);

            Clients.User(Context.ConnectionId).removeGroupToShow(Context.ConnectionId + "remove to group");
        }
    }
}