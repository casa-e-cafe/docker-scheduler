# docker-scheduler

Scheduler de Jobs para Swarm. 

A imagem docker está disponibilizada no link https://hub.docker.com/r/casaecafe/job-scheduler

Ao executar, este componente disponbiliza na porta 3000 do container uma UI para edição dos jobs agendados.

É aconselháve que um volume seja mapeado para o container, de forma a manter salvas as criações e alterações de jobs agendados.

Exemplo de execução com o mapeamento de volume:

`> docker run --name casaecafe-scheduler -v $PWD/schedules:/usr/src/cron/schedules -p 8080:3000 -d casaecafe/job-scheduler`
