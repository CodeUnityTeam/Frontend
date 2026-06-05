import { Button } from "@/shared/ui/button";
import {InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/input/input-group";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { mockTags } from "../model/tags-data";

const SEARCH_TAGS_LIMIT = 10;

export function Search(){
    
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchTag, setSearchTag] = useState<string[]>(mockTags);
    const isMobile = window.innerWidth < 768;

    const handleSearch = () => {
        if (!searchValue.trim()) {
            return;
        }
        setSearchTag((prev) => {
            const filtered = prev.filter((tag)=> tag.toLowerCase() !== searchValue.toLowerCase())
            return [searchValue, ...filtered].slice(0, SEARCH_TAGS_LIMIT)
        });
        setSearchValue("");
    };

    return (
        <div className="flex flex-col justify-start max-md:px-5 px-20 py-4">
            <InputGroup>
                <InputGroupAddon>
                    <Icon icon='material-symbols:search' className="size-6"></Icon>
                </InputGroupAddon>
                <InputGroupInput type='text' value={searchValue} 
                onChange={(e)=>setSearchValue(e.target.value)} 
                onKeyDown={(e)=> {if (e.key === 'Enter'){handleSearch()}}}
                placeholder={isMobile ? "Поиск" : "Поиск проектов и команд"}/>
                <InputGroupAddon align="inline-end">{
                    isMobile ? <Button variant="outline" size="sm" onClick={()=>{handleSearch()}}>Найти</Button> :
                    <Button variant="outline" size="lg" onClick={()=>{handleSearch()}}>Найти</Button>}
                </InputGroupAddon>
            </InputGroup>
            <div className="flex flex-wrap gap-2 mt-3">
                {searchTag.map((tag, index)=>
                <span key={`${tag}-${index}`} className="flex align-baseline justify-center px-3 py-1 border border-border rounded-lg">{tag}</span>
                 )}
            </div>
        </div>
    );
};
