import fs from "fs/promises"
import path from "path"

const SNAPSHOT_DIR = path.join(process.cwd(),"snapshots")
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR,"snapshot.json")
const TEMP_FILE = path.join(SNAPSHOT_DIR,"latest.tmp")

export async function saveSnapShot(
        orderbook:any,
        balances:any
){
        try{
                await fs.mkdir(SNAPSHOT_DIR,{recursive:true})

                await fs.writeFile(
                        TEMP_FILE,
                        JSON.stringify(
                                {
                                        timestamp:new Date().toISOString(),
                                        orderbook,
                                        balances
                                },
                                null,
                                2
                        )
                )

                await fs.rename(
                        TEMP_FILE,
                        SNAPSHOT_FILE
                );

                console.log(
                        `[Snapshot] Saved @${new Date().toLocaleDateString()}`
                )
        }catch(error){
                console.error("Snapshot Save Failed", err);
        }
}

export async function loadSnapShot(){
        try {
                const file = await fs.readFile(SNAPSHOT_FILE,'utf-8')

                const snapshot = JSON.parse(file)

                console.log(`[Snapshot] Loaded @${new Date(snapshot.timestamp).toLocaleDateString()}`)

                return snapshot

        } catch (error) {
                console.log(`[Snapshot] No previous snapshot`)
                return null
        }
}

export async function shutdown(orderbook:any,balances:any) {
    console.log("Saving final snapshot...");

    await saveSnapShot(
        orderbook,
        balances
    )

    process.exit(0)
}