---
title: "Network"
---

Are your packets stuck in the door? Don't worry, here is a quick guide to resolve any problems.

## Step 1: Check the basics

- Ethernet cable plugged in firmly
- Link light on your PC or laptop
- Disable VPNs, custom firewalls, or network tools

## Step 2: Check if you're online

- Open the LAN portal ([spawn.ctrl-alt-gg.hu](https://spawn.ctrl-alt-gg.hu))
- If it loads:
  - Network is working
  - Check the server status page ([servers.ctrl-alt-gg.hu](https://servers.ctrl-alt-gg.hu))
- If it doesn't load:
  - Try unplugging and reconnecting the cable
  - Try a different port
  - Try Wi-Fi

## Step 3: Can you reach LAN services?

- Game downloads slow or failing?
  - Check server status page ([servers.ctrl-alt-gg.hu](https://servers.ctrl-alt-gg.hu))
  - One game server unreachable?
    - Likely that server is restarting or full
  - Everything broken?
    - Probably a wider issue, **tell staff**

## Step 4: Quick local checks

- Restart your network adapter
- Renew IP address (or reboot)
- Make sure you didn't set a manual IP earlier

## Step 5: When to ask for help

- Tell staff if:
  - You have no network at all
  - You can open the portal but nothing else works
  - Multiple people around you have the same issue

## When asking, say

- Wired or Wi-Fi
- What works, what doesn't
- Your device type (PC / laptop / console) and operating system

---

This LAN is built as a simple routed core with clean separation of roles, optimized for reliability and fast fault isolation.
High-level layout

- Internet -> Juniper SRX340 firewall -> Arista L3 core -> Juniper EX3300 access switches
- All inter-device links use /31 point-to-point routing, no spanning-tree dependency between switches.
- Access switches are pure edge devices; routing decisions happen at the core.

## Addressing & segmentation

### Access VLANs (140-150)

- Guest devices
- DHCP, internet + LAN services only
- Future: No access to management

### Services VLAN (130)

- Game servers, file host, DNS, DHCP (Kea)

### Management VLAN (128)

- Network devices only
- Future: no guest access

### Wireless VLAN (132)

- Same policy as access VLANs

### IoT VLAN (131)

- Present: Same as access VLANs
- Future: Internet only, isolated from everything else

## Traffic flow

- Clients -> access switch -> core gateway -> firewall -> internet
- LAN services stay inside the core, never hairpin through the firewall.
- Firewall policies are permissive internally; security focus is on edge protection and NAT.

## Design intent

- No L2 complexity
- Predictable failure domains
- Fast "is it access / core / firewall?" troubleshooting
- Everything observable from server status + basic ping tests
