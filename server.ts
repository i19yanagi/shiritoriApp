import { serve } from "https://deno.land/std@0.114.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
let previousWord = "しりとり";

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);
    if (req.method === "GET" && pathname === "/shiritori") {
        return new Response(previousWord);
    }
    if (req.method === "POST" && pathname === "/shiritori") {
        const requestJson = await req.json();
        const nextWord = requestJson.nextWord;
        if (nextWord.substring(nextWord.length-1, nextWord.length) === "\u{3093}") {
            return new Response("最後の文字が\"ん\"です", {status: 401});
        }
        if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
            return new Response("前の単語に続いていません", {status: 400});
        }
        previousWord = nextWord;
        return new Response(previousWord);
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
