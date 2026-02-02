---
title: "Hálózat"
---

Elakadtak a csomagjaid az ajtóban? Ne aggódj, itt egy gyors útmutató a problémák megoldásához.

## 1. lépés: Ellenőrizd az alapokat

- Az Ethernet-kábel megfelelően be van dugva
- Link-jelző világít a PC-n vagy laptopon
- VPN-ek, egyéni tűzfalak vagy hálózati eszközök ki vannak kapcsolva

## 2. lépés: Ellenőrizd, hogy online vagy-e

- Nyisd meg a LAN portált (spawn.ctrl-alt-gg.hu)
- Ha betölt:
  - A hálózat működik
  - Ellenőrizd a szerver állapot oldalt (servers.ctrl-alt-gg.hu)
- Ha nem tölt be:
  - Próbáld kihúzni és visszadugni a kábelt
  - Próbálj ki egy másik portot
  - Próbáld Wi-Fi-n

## 3. lépés: Eléred a LAN szolgáltatásokat?

- Lassú vagy sikertelen a játékletöltés?
  - Ellenőrizd a szerver állapot oldalt (servers.ctrl-alt-gg.hu)
  - Egy játékszerver elérhetetlen?
    - Valószínűleg az a szerver újraindul vagy tele van
  - Minden elromlott?
    - Valószínűleg szélesebb körű probléma, **szólj a staffnak**

## 4. lépés: Gyors helyi ellenőrzések

- Indítsd újra a hálózati adaptert
- Újítsd meg az IP-címet (vagy indítsd újra a gépet)
- Győződj meg róla, hogy nem állítottál be korábban manuális IP-t

## 5. lépés: Mikor kérj segítséget

- Szólj a staffnak, ha:
  - Egyáltalán nincs hálózatod
  - Megnyílik a portál, de semmi más nem működik
  - Több ember körülötted ugyanezzel a problémával küzd

## Amikor segítséget kérsz, mondd el

- Vezetékes vagy Wi-Fi
- Mi működik, mi nem
- Eszközöd típusa (PC / laptop / konzol) és operációs rendszer

---

Ez a LAN egyszerű útválasztott core architektúrával épült, tiszta szerepelválasztással, megbízhatóságra és gyors hibaelhárításra optimalizálva.

## Magas szintű elrendezés

- Internet -> Juniper SRX340 tűzfal -> Arista L3 core -> Juniper EX3300 access switchek
- Minden eszközök közötti kapcsolat /31 pont-pont útválasztást használ, nincs spanning-tree függőség a switchek között.
- Az access switchek tisztán edge eszközök; az útválasztási döntések a core-on történnek.

## Címzés és szegmentáció

### Access VLAN-ok (140-150)

- Vendég eszközök
- DHCP, internet + LAN szolgáltatások
- Jövőben: Nincs hozzáférés a menedzsmenthez

### Szolgáltatások VLAN (130)

- Játékszerverek, fájlszerver, DNS, DHCP (Kea)

### Menedzsment VLAN (128)

- Csak hálózati eszközök
- Jövőben: nincs vendég hozzáférés

### Vezeték nélküli VLAN (132)

- Ugyanaz a szabályzat, mint az access VLAN-oknál

### IoT VLAN (131)

- Jelenleg: Ugyanaz, mint az access VLAN-ok
- Jövőben: Csak internet, minden mástól izolálva

## Forgalomáramlás

- Kliensek -> access switch -> core gateway -> tűzfal -> internet
- A LAN szolgáltatások a core-on belül maradnak, soha nem mennek vissza a tűzfalon keresztül.
- A tűzfal szabályzatok belsőleg megengedőek; a biztonsági fókusz a peremvédelmen és a NAT-on van.

## Tervezési szándék

- Nincs L2 komplexitás
- Kiszámítható hibatartományok
- Gyors "access / core / tűzfal?" hibaelhárítás
- Minden megfigyelhető a szerver állapot oldalról + alapvető ping tesztekből
