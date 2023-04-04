const RowSchema = require("../../models/RowSchema");
const TicketSchema = require("../../models/TicketSchema");

const router = require("express")();

router.get("/bookedTickets", async (req, res) => {
  try {
    const bookedTickets = await TicketSchema.find();
    return res.status(200).json({ count: bookedTickets.length, bookedTickets });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in /bookedTickets [GET]", error });
  }
});

router.get("/ticketById/:id", async (req, res) => {
  try {
    const ticket_id = req.params.id;
    const ticketInfo = await TicketSchema.findById(ticket_id);
    return res.status(200).json({ ticketInfo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in /ticketById/:id [GET]", error });
  }
});

router.get('/availabe', async(req, res) => {
  try {
    // all tickets
    let allTicketsNumber = Array.from(Array(80+1).keys()).slice(1);
    // console.log(allTicketsNumber);
  
    // get booked tickets and filter unbooked tickets
    let bookedTickets = await TicketSchema.find();
    let unbookedTickets = allTicketsNumber.filter((ticket, index) => bookedTickets.findIndex((t) => t.seatNumber === ticket) === -1);
    res.status(200).json(unbookedTickets);
  } catch (error) {
    res.status(500).json(error);
  }
})

function getRowNumber(seatNumber) {
  try {
    if (seatNumber >= 78 && seatNumber <= 80) {
      return 12;
    } else if (seatNumber > 0 && seatNumber <= 7) {
      return 1;
    } else {
      return Math.ceil(seatNumber / 7);
    }
  } catch (error) {
    throw new Error("[FROM] getRowNumber()", error);
  }
}

router.post('/book', async(req, res) => {
  try {
    const result = [];
    const ticketsToBeBooked = req.body.ticketsToBeBooked;
    if(!ticketsToBeBooked) return res.status(403).json({Error: 'ticketsToBeBooked is not given'})
    const userSelectedTickets = req.body.userSelectedTickets;
    console.log(req.body);
    if(ticketsToBeBooked > 7) return res.status(403).json({Error: 'Only 7 tickets at a time can be booked'});
    // all tickets
    let allTicketsNumber = Array.from(Array(80+1).keys()).slice(1);
    // console.log(allTicketsNumber);
  
    // get booked tickets and filter unbooked tickets
    let bookedTickets = await TicketSchema.find();
    let unbookedTickets = allTicketsNumber.filter((ticket, index) => bookedTickets.findIndex((t) => t.seatNumber === ticket) === -1);
    // console.log(unbookedTickets);
  
    if(ticketsToBeBooked > unbookedTickets.length) return res.status(403).json({Error: 'Not Sufficient Tickets', availableTickets: unbookedTickets.length});
  
    if(userSelectedTickets?.length){
      if(userSelectedTickets.length !== ticketsToBeBooked) return res.status(403).json({Error: 'selected tickets and tickets to be booked are not equal'});
      if(!userSelectedTickets.every((ticket) => unbookedTickets.includes(ticket))) return res.status(403).json({Error: 'Some User Selected tickets have been already booked'});
      for(let i=0; i<userSelectedTickets.length; i++){
        const allotedSeat = userSelectedTickets[i];
        const allocatedRow = getRowNumber(allotedSeat);
        const bookedTicket = await new TicketSchema({seatNumber: allotedSeat, rowNumber: allocatedRow}).save();
        result.push(bookedTicket);
      }
      return res.status(200).json({message: 'Tickets Booked Sucessfully', tickets: result});
    }else{
      for(let i=0; i<ticketsToBeBooked; i++){
        const allotedSeat = unbookedTickets[i];
        const allocatedRow = getRowNumber(allotedSeat);
        const bookedTicket = await new TicketSchema({seatNumber: allotedSeat, rowNumber: allocatedRow}).save();
        result.push(bookedTicket);
      }
      return res.status(200).json({message: 'Tickets Booked Sucessfully', tickets: result});
    } 
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;
